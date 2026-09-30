import { normalizeMedia } from "./normalizeMedia";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';
const CACHE_TTL = 60 * 60 * 1000; 
const CACHE_PREFIX = 'cine_';

export class ApiLimitError extends Error {
  constructor() {
    super('Daily request limit reached. Please try again tomorrow.');
    this.name = 'ApiLimitError';
  }
}

function storageKeyFor(key) {
  return CACHE_PREFIX + key.toLowerCase().trim();
}

function pruneExpired() {
  const now = Date.now();
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const storageKey = localStorage.key(i);
    if (!storageKey || !storageKey.startsWith(CACHE_PREFIX)) continue;
    try {
      const { timestamp } = JSON.parse(localStorage.getItem(storageKey));
      if (now - timestamp > CACHE_TTL) localStorage.removeItem(storageKey);
    } catch {
      localStorage.removeItem(storageKey);
    }
  }
}

export const cache = {
  get(key) {
    try {
      const storageKey = storageKeyFor(key);
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const { data, timestamp } = JSON.parse(raw);
      if (Date.now() - timestamp > CACHE_TTL) {
        localStorage.removeItem(storageKey);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },
  set(key, data) {
    const storageKey = storageKeyFor(key);
    const payload = JSON.stringify({ data, timestamp: Date.now() });
    try {
      localStorage.setItem(storageKey, payload);
    } catch {
      pruneExpired();
      try {
        localStorage.setItem(storageKey, payload);
      } catch {
        console.warn('cine cache: unable to store data, storage is full');
      }
    }
  },
};

async function withCache(key, fetcher) {
  const cached = cache.get(key);
  if (cached) return cached;
  const data = await fetcher();
  cache.set(key, data);
  return data;
}

function toScore(rating) {
  return parseFloat(rating) || 0;
}

async function omdb(params, signal) {
  const url = new URL(BASE_URL);
  url.searchParams.set('apikey', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { signal });

  let json = null;
  try {
    json = await res.json();
  } catch {
    // not Json
  }

  if (json?.Error && /limit reached/i.test(json.Error)) {
    throw new ApiLimitError();
  }
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  if (!json) throw new Error('Invalid response from server');
  if (json.Response === 'False') throw new Error(json.Error || 'No results found');
  return json;
}

async function fetchDetail(id, signal) {
  try {
    const raw = await withCache(`detail_${id}_short`, () => omdb({ i: id, plot: 'short' }, signal));
    return normalizeMedia(raw);
  } catch (err) {
    if (err instanceof ApiLimitError) throw err;
    if (err.name === 'AbortError') throw err;
    return null;
  }
}

export async function searchMedia(query, type, { page = 1, year, signal } = {}) {
  const key = `search_${type}_${query}_${page}_${year || 'any'}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const params = { s: query, type, page };
  if (year) params.y = year;

  const data = await omdb(params, signal);
  const basic = data.Search || [];

  let incomplete = false;

  const enriched = await Promise.all(
    basic.map(async (item) => {
      const detail = await fetchDetail(item.imdbID, signal);
      if (!detail) {
        incomplete = true;
        return normalizeMedia(item);
      }
      return detail;
    })
  );

  const result = {
    items: enriched,
    totalResults: parseInt(data.totalResults, 10) || 0,
  };

  if (!incomplete) cache.set(key, result);
  return result;
}

export async function getMediaById(id) {
  const raw = await withCache(`detail_${id}_full`, () => omdb({ i: id, plot: 'full' }));
  return normalizeMedia(raw);
}

export async function getTopRated(type = 'movie') {
  const titles = type === 'movie'
    ? ['Inception', 'The Dark Knight', 'Interstellar', 'Parasite', 'Oppenheimer', 'The Godfather', 'Dune', 'Schindler\'s List']
    : ['Breaking Bad', 'Chernobyl', 'The Wire', 'Band of Brothers', 'Succession', 'The Sopranos', 'True Detective', 'Sherlock'];

  const key = `toprated_${type}`;
  const cached = cache.get(key);
  if (cached) return cached;

  let incomplete = false;

  const results = await Promise.all(
    titles.map(async (title) => {
      try {
        const raw = await omdb({ t: title, type, plot: 'short' });
        return normalizeMedia(raw);
      } catch (err) {
        if (err instanceof ApiLimitError) throw err;
        incomplete = true;
        return null;
      }
    })
  );

  const valid = results.filter(Boolean).sort((a, b) => toScore(b.rating) - toScore(a.rating));

  if (!incomplete) cache.set(key, valid);
  return valid;
}