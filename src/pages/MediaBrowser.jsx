import { useSearchParams } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import { SearchBar } from "../components/SearchBar";
import { MovieGrid } from "../components/MovieGrid";
import { SkeletonGrid } from "../components/Loader";
import { ErrorMessage, EmptyState } from "../components/ErrorMessage";
import "./MediaBrowser.css";

export function MediaBrowser({ type, label, placeholder }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const year = searchParams.get("y") ?? "";
  const sort = searchParams.get("sort") ?? "rating";

  const { results, loading, loadingMore, error, loadMore, hasMore, totalResults } =
    useSearch(query, type, { year, sort });

  const updateParams = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next);
  };

  const handleSearch = (q) => updateParams({ q });
  const handleYearChange = (e) => updateParams({ y: e.target.value.trim() });
  const handleSortChange = (e) => updateParams({ sort: e.target.value });

  return (
    <main className="browser page-enter">
      <div className="container">
        <div className="browser__header">
          <div className="browser__heading">
            <h1 className="browser__title">{label}</h1>
            {results.length > 0 && query && (
              <span className="browser__count">
                {results.length} of {totalResults} results for "{query}"
              </span>
            )}
          </div>
          <div className="browser__search-wrap">
            <SearchBar initialValue={query} onSearch={handleSearch} placeholder={placeholder} />
          </div>
        </div>

        {query && (
          <div className="browser__filters">
            <label className="browser__filter">
              Year
              <input
                type="number"
                inputMode="numeric"
                placeholder="e.g. 2010"
                defaultValue={year}
                onBlur={handleYearChange}
                onKeyDown={(e) => e.key === "Enter" && handleYearChange(e)}
                className="browser__year-input"
              />
            </label>

            <label className="browser__filter">
              Sort by
              <select value={sort} onChange={handleSortChange} className="browser__sort-select">
                <option value="rating">Highest rating</option>
                <option value="year">Newest first</option>
              </select>
            </label>
          </div>
        )}

        <div className="browser__results">
          {loading && <SkeletonGrid count={10} />}
          {!loading && error && <ErrorMessage message={error} />}
          {!loading && !error && results.length > 0 && (
            <>
              <MovieGrid items={results} />
              {hasMore && (
                <button
                  type="button"
                  className="browser__load-more"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </button>
              )}
            </>
          )}
          {!loading && !error && results.length === 0 && (
            <EmptyState query={query} type={label.toLowerCase()} />
          )}
        </div>
      </div>
    </main>
  );
}