import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { searchMedia } from "../utils/api";
import { useDebounce } from "./useDebounce";

function sortResults(items, sort) {
  const sorted = [...items];
  if (sort === "year") {
    sorted.sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0));
  } else {
    sorted.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
  }
  return sorted;
}

export function useSearch(query, type, { year, sort = "rating" } = {}) {
  const [rawResults, setRawResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const debouncedQuery = useDebounce(query, 400);

  const abortRef = useRef(null);

  useEffect(() => {
    const q = (debouncedQuery || "").trim();
    abortRef.current?.abort();

    if (q.length < 2) {
      setRawResults([]);
      setTotalResults(0);
      setPage(1);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setPage(1);

    searchMedia(q, type, { page: 1, year, signal: controller.signal })
      .then(({ items, totalResults: total }) => {
        if (controller.signal.aborted) return;
        setRawResults(items);
        setTotalResults(total);
      })
      .catch((err) => {
        if (controller.signal.aborted || err.name === "AbortError") return;
        setError(err.message);
        setRawResults([]);
        setTotalResults(0);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery, type, year]);

  const loadMore = useCallback(() => {
    const q = (debouncedQuery || "").trim();
    if (q.length < 2 || loadingMore) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const nextPage = page + 1;
    setLoadingMore(true);

    searchMedia(q, type, { page: nextPage, year, signal: controller.signal })
      .then(({ items, totalResults: total }) => {
        if (controller.signal.aborted) return;
        setRawResults((current) => [...current, ...items]);
        setTotalResults(total);
        setPage(nextPage);
      })
      .catch((err) => {
        if (controller.signal.aborted || err.name === "AbortError") return;
        setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingMore(false);
      });
  }, [debouncedQuery, type, year, page, loadingMore]);

  const results = useMemo(() => sortResults(rawResults, sort), [rawResults, sort]);
  const hasMore = results.length < totalResults;

  return { results, loading, loadingMore, error, loadMore, hasMore, totalResults };
}