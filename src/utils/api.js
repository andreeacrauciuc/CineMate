const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export const cache = {
  get(key) {
    try {
      const raw = localStorage.getItem(`cine_${key}`);
      if (!raw) return null;
      const { data, timestamp } = JSON.parse(raw);
      if (Date.now() - timestamp > CACHE_TTL) {
        localStorage.removeItem(`cine_${key}`);
        return null;
      }
      return data;
    } catch { return null; }
  },
  set(key, data) {
    try {
      localStorage.setItem(`cine_${key}`, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {}
  },
};

async function omdb(params) {
  const url = new URL(BASE_URL);
  url.searchParams.set('apikey', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  const json = await res.json();
  if (json.Response === 'False') throw new Error(json.Error || 'No results found');
  return json;
}

async function fetchDetail(id) {
  const key = `detail_${id}`;
  const cached = cache.get(key);
  if (cached) return cached;
  try {
    const data = await omdb({ i: id, plot: 'short' });
    cache.set(key, data);
    return data;
  } catch { return null; }
}

// Search returns basic results; we enrich them with rating+plot in parallel
export async function searchMedia(query, type, page = 1) {
  const key = `search_${type}_${query}_${page}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const data = await omdb({ s: query, type, page });
  const basic = data.Search || [];

  // Enrich up to 10 results with full detail (plot + rating)
  const enriched = await Promise.all(
    basic.map(async (item) => {
      const detail = await fetchDetail(item.imdbID);
      return detail ? { ...item, ...detail } : item;
    })
  );

  enriched.sort((a, b) => {
    const ra = parseFloat(a.imdbRating) || 0;
    const rb = parseFloat(b.imdbRating) || 0;
    return rb - ra;
  });

  const result = { ...data, Search: enriched };
  cache.set(key, result);
  return result;
}

export async function getMediaById(id) {
  const key = `detail_${id}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const data = await omdb({ i: id, plot: 'full' });
  cache.set(key, data);
  return data;
}

export async function getTopRated(type = 'movie') {
  const titles = type === 'movie'
    ? ['Inception', 'The Dark Knight', 'Interstellar', 'Parasite', 'Oppenheimer', 'The Godfather', 'Dune', 'Schindler\'s List']
    : ['Breaking Bad', 'Chernobyl', 'The Wire', 'Band of Brothers', 'Succession', 'The Sopranos', 'True Detective', 'Sherlock'];

  const key = `toprated_${type}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const results = await Promise.all(
    titles.map(async (title) => {
      try {
        const data = await omdb({ t: title, type, plot: 'short' });
        return data;
      } catch { return null; }
    })
  );

  const valid = results
    .filter(Boolean)
    .sort((a, b) => (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0));

  cache.set(key, valid);
  return valid;
}
