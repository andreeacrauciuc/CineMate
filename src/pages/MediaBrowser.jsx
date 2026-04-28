import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { MovieGrid } from "../components/MovieGrid";
import { SkeletonGrid } from "../components/Loader";
import { ErrorMessage, EmptyState } from "../components/ErrorMessage";
import "./MediaBrowser.css";

export function MediaBrowser({ useHook, type, label, placeholder }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const { results, loading, error } = useHook(query);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (query) setSearchParams({ q: query }, { replace: true });
    else setSearchParams({}, { replace: true });
  }, [query, setSearchParams]);

  return (
    <main className="browser page-enter">
      <div className="container">
        <div className="browser__header">
          <div className="browser__heading">
            <h1 className="browser__title">{label}</h1>
            {results.length > 0 && query && (
              <>
                <span className="browser__count">
                  {results.length} results for "{query}"
                </span>
                <span className="browser__sort-label">
                  <svg
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M3 6h18M7 12h10M11 18h2" />
                  </svg>
                  Sorted by highest IMDb rating
                </span>
              </>
            )}
          </div>
          <div className="browser__search-wrap">
            <SearchBar
              initialValue={query}
              onSearch={setQuery}
              placeholder={placeholder}
            />
          </div>
        </div>

        <div className="browser__results">
          {loading && <SkeletonGrid count={10} />}
          {!loading && error && <ErrorMessage message={error} />}
          {!loading && !error && results.length > 0 && (
            <MovieGrid items={results} />
          )}
          {!loading && !error && results.length === 0 && (
            <EmptyState query={query} type={label.toLowerCase()} />
          )}
        </div>
      </div>
    </main>
  );
}
