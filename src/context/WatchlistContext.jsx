import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "cinemate_watchlist";
const WatchlistContext = createContext(null);

function getStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function dedupeWatchlist(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.id) return false;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function pickWatchlistFields(item) {
  if (!item?.id) return null;
  const { id, title, year, poster, rating, type, status, addedAt } = item;
  return {
    id,
    title,
    year,
    poster,
    rating,
    type,
    status: status === "watched" ? "watched" : "to_watch",
    addedAt: addedAt ?? Date.now(),
  };
}

function readWatchlist() {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? dedupeWatchlist(parsed.map(pickWatchlistFields).filter(Boolean))
      : [];
  } catch {
    return [];
  }
}

function writeWatchlist(items) {
  const storage = getStorage();
  if (!storage) return;

  try {
    if (!items.length) storage.removeItem(STORAGE_KEY);
    else storage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage write failures.
  }
}

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => readWatchlist());

  useEffect(() => {
    writeWatchlist(watchlist);
  }, [watchlist]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== STORAGE_KEY) return;
      try {
        const parsed = event.newValue ? JSON.parse(event.newValue) : [];
        const next = Array.isArray(parsed)
          ? dedupeWatchlist(parsed.map(pickWatchlistFields).filter(Boolean))
          : [];
        setWatchlist(next);
      } catch {
        setWatchlist([]);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo(() => {
    const isInWatchlist = (id) => watchlist.some((item) => item.id === id);

    const toggleWatchlist = (item) => {
      const next = pickWatchlistFields(item);
      if (!next) return;

      setWatchlist((current) => {
        const exists = current.some((entry) => entry.id === next.id);
        if (exists) return current.filter((entry) => entry.id !== next.id);
        return dedupeWatchlist([...current, next]);
      });
    };

    const removeFromWatchlist = (id) => {
      setWatchlist((current) => current.filter((entry) => entry.id !== id));
    };

        const setWatchStatus = (id, status) => {
      setWatchlist((current) =>
        current.map((entry) => (entry.id === id ? { ...entry, status } : entry))
      );
    };

    const clearWatchlist = () => setWatchlist([]);
    return { watchlist, isInWatchlist, toggleWatchlist, removeFromWatchlist, setWatchStatus, clearWatchlist };
  }, [watchlist]);

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}