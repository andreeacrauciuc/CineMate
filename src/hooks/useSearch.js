import { useState, useEffect, useCallback } from "react";
import { searchMedia } from "../utils/api";
import { useDebounce } from "./useDebounce";

function useSearch(query, type) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedQuery = useDebounce(query, 400);

  const fetchData = useCallback(
    async (q) => {
      if (!q || q.trim().length < 2) {
        setResults([]);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await searchMedia(q.trim(), type);
        setResults(data.Search || []);
      } catch (err) {
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [type],
  );

  useEffect(() => {
    fetchData(debouncedQuery);
  }, [debouncedQuery, fetchData]);

  return { results, loading, error };
}

export default useSearch;
