import { useState } from "react";
import { Link } from "react-router-dom";
import { MovieGrid } from "../components/MovieGrid";
import { useWatchlist } from "../context/WatchlistContext";
import "./MediaBrowser.css";
import "./Watchlist.css";

function EmptyWatchlist() {
  return (
    <div className="watchlist-empty">
      <svg viewBox="0 0 120 120" className="watchlist-empty__art" aria-hidden="true">
        <path d="M38 22h44a6 6 0 0 1 6 6v66l-28-14-28 14V28a6 6 0 0 1 6-6Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M48 43h24M48 55h24M48 67h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h2 className="watchlist-empty__title">Your watchlist is empty</h2>
      <p className="watchlist-empty__copy">Save films and series as you browse to build a personal shortlist.</p>
      <Link className="watchlist-empty__cta" to="/">Back to Browse</Link>
    </div>
  );
}

function sortItems(items, sort) {
  const sorted = [...items];
  if (sort === "rating") {
    sorted.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
  } else if (sort === "year") {
    sorted.sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0));
  } else {
    sorted.sort((a, b) => b.addedAt - a.addedAt); 
  }
  return sorted;
}

export function Watchlist() {
  const { watchlist } = useWatchlist();
  const [activeFilter, setActiveFilter] = useState("all");
  const [sort, setSort] = useState("added");

  const hasMovies = watchlist.some((item) => item.type !== "series");
  const hasSeries = watchlist.some((item) => item.type === "series");
  const showFilters = hasMovies && hasSeries;
  const filter = showFilters ? activeFilter : "all";

  const filtered =
    filter === "all" ? watchlist : watchlist.filter((item) => item.type === filter);
  const items = sortItems(filtered, sort);

  const watchedCount = watchlist.filter((item) => item.status === "watched").length;
  const rated = watchlist.map((item) => parseFloat(item.rating)).filter((n) => !Number.isNaN(n));
  const avgRating = rated.length ? (rated.reduce((sum, n) => sum + n, 0) / rated.length).toFixed(1) : null;

  return (
    <main className="browser page-enter watchlist-page">
      <div className="container">
        <div className="browser__header watchlist__header">
          <div className="browser__heading">
            <span className="browser__type-tag">Saved collection</span>
            <h1 className="browser__title">Watchlist</h1>
            <span className="browser__count">{watchlist.length} saved items</span>
          </div>

          {showFilters && (
            <div className="watchlist__filters" role="tablist" aria-label="Watchlist filters">
              {[
                ["all", "All"],
                ["movie", "Movies"],
                ["series", "Series"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={filter === value}
                  className={`watchlist__pill ${filter === value ? "active" : ""}`}
                  onClick={() => setActiveFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {watchlist.length > 0 && (
          <div className="watchlist__stats">
            <div className="watchlist__stat">
              <span className="watchlist__stat-value">{watchlist.length}</span>
              <span className="watchlist__stat-label">Saved</span>
            </div>
            <div className="watchlist__stat">
              <span className="watchlist__stat-value">{watchedCount}</span>
              <span className="watchlist__stat-label">Watched</span>
            </div>
            <div className="watchlist__stat">
              <span className="watchlist__stat-value">{avgRating ?? "—"}</span>
              <span className="watchlist__stat-label">Avg. rating</span>
            </div>

            <label className="watchlist__sort">
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="added">Recently added</option>
                <option value="rating">Highest rating</option>
                <option value="year">Newest release</option>
              </select>
            </label>
          </div>
        )}

        <div className="browser__results">
          {items.length > 0 ? <MovieGrid items={items} showStatus /> : <EmptyWatchlist />}
        </div>
      </div>
    </main>
  );
}