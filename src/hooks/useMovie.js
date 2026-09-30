import { useState, useEffect } from "react";
import { getMediaById } from "../utils/api";

export function useMovie(id) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setMovie(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setMovie(null);
    setLoading(true);
    setError(null);

    const loadMovie = async () => {
      try {
        const data = await getMediaById(id);
        if (!cancelled) setMovie(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadMovie();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { movie, loading, error };
}