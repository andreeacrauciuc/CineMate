import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { MovieCard } from "../components/MovieCard";
import { SkeletonGrid } from "../components/Loader";
import { getTopRated } from "../utils/api";
import "./Home.css";

export function Home() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("movie");
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    setLoadingFeatured(true);
    setFeatured([]);
    getTopRated(searchType)
      .then(setFeatured)
      .finally(() => setLoadingFeatured(false));
  }, [searchType]);

  const handleSearch = (query) => {
    if (!query) return;
    navigate(
      `/${searchType === "movie" ? "movies" : "series"}?q=${encodeURIComponent(query)}`,
    );
  };

  return (
    <main className="home">
      <div className="home__bg" aria-hidden="true">
        <div className="home__grain" />
      </div>

      <div className="container">
        <div className="home__hero">
          <div className="home__badge">
            <span className="home__badge-dot" />
            BEYOND RATINGS.
          </div>

          <h1 className="home__title">
            Find Your Next
            <br />
            <span className="home__title-accent">Obsession.</span>
          </h1>

          <p className="home__desc">
            Search millions of movies and TV series. Instantly see ratings,
            descriptions, and personalized recommendations.
          </p>

          <div className="home__toggle" role="group">
            <button
              className={`home__toggle-btn ${searchType === "movie" ? "active" : ""}`}
              onClick={() => setSearchType("movie")}
            >
              🎬 Movies
            </button>
            <button
              className={`home__toggle-btn ${searchType === "series" ? "active" : ""}`}
              onClick={() => setSearchType("series")}
            >
              📺 Series
            </button>
          </div>

          <div className="home__search">
            <SearchBar
              onSearch={handleSearch}
              placeholder={
                searchType === "movie"
                  ? "Search for a movie…"
                  : "Search for a series…"
              }
              autoFocus
            />
          </div>
        </div>

        {/* Top rated section */}
        <div className="home__featured">
          <div className="home__featured-header">
            <h2 className="home__featured-title">
              Top Rated {searchType === "movie" ? "Movies" : "Series"}
            </h2>
            <span className="home__featured-sub">Sorted by IMDb rating</span>
          </div>

          {loadingFeatured ? (
            <SkeletonGrid count={8} />
          ) : (
            <div className="home__cards-grid">
              {featured.map((item, i) => (
                <div
                  key={item.imdbID}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <MovieCard movie={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
