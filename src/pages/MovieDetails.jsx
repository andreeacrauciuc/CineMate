import { useParams, useNavigate } from "react-router-dom";
import { useMovie } from "../hooks/useMovie";
import { useWatchlist } from "../context/WatchlistContext";
import { RecommendationBanner } from "../components/RecommendationBanner";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import { Poster } from "../components/Poster";
import { BookmarkIcon } from "../components/Icon";
import { FALLBACK_POSTER } from "../utils/poster";
import "./MovieDetails.css";

function Badge({ children }) {
  return <span className="detail-badge">{children}</span>;
}

function Stat({ label, value }) {
  if (!value) return null;
  return (
    <div className="detail-stat">
      <span className="detail-stat__label">{label}</span>
      <span className="detail-stat__value">{value}</span>
    </div>
  );
}

export function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, loading, error } = useMovie(id);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  if (loading)
    return (
      <div className="detail-loading">
        <Loader text="Fetching details…" />
      </div>
    );
  if (error)
    return (
      <div className="container detail-error">
        <ErrorMessage message={error} />
      </div>
    );
  if (!movie) return null;

  const genres = movie.genre?.split(", ") || [];
  const inWatchlist = isInWatchlist(movie.id);

  return (
    <main className="detail page-enter">
      <div
        className="detail__bg-poster"
        style={{ backgroundImage: `url("${movie.poster || FALLBACK_POSTER}")` }}
        aria-hidden="true"
      >
        <div className="detail__bg-overlay" />
      </div>

      <div className="container">
        <button className="detail__back" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>

        <div className="detail__layout">
          <aside className="detail__poster-col">
            <div className="detail__poster-wrap">
              <Poster src={movie.poster} alt={movie.title} className="detail__poster" />
            </div>

            {movie.rating && (
              <div className="detail__imdb">
                <div className="detail__imdb-top">
                  <span className="detail__imdb-star">★</span>
                  <span className="detail__imdb-score">{movie.rating}</span>
                  <span className="detail__imdb-max">/10</span>
                </div>
                {movie.votes && <p className="detail__imdb-votes">{movie.votes} votes</p>}
              </div>
            )}
          </aside>

          <section className="detail__info">
            <div className="detail__meta">
              <span className="detail__type">{movie.type}</span>
              {movie.year && <span className="detail__year">{movie.year}</span>}
              {movie.rated && <span className="detail__rated">{movie.rated}</span>}
            </div>

            <h1 className="detail__title">{movie.title}</h1>

            <div className="detail__actions">
              <button
                type="button"
                className={`detail__watchlist-btn ${inWatchlist ? "is-active" : ""}`}
                onClick={() => toggleWatchlist(movie)}
                aria-pressed={inWatchlist}
              >
                <BookmarkIcon filled={inWatchlist} />
                {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </button>
            </div>

            {genres.length > 0 && (
              <div className="detail__genres">
                {genres.map((g) => (
                  <Badge key={g}>{g}</Badge>
                ))}
              </div>
            )}

            {movie.plot && <p className="detail__plot">{movie.plot}</p>}

            <RecommendationBanner rating={movie.rating} type={movie.type} />

            <div className="detail__stats">
              <Stat label="Director" value={movie.director} />
              <Stat label="Cast" value={movie.actors} />
              <Stat label="Runtime" value={movie.runtime} />
              <Stat label="Language" value={movie.language} />
              <Stat label="Country" value={movie.country} />
              <Stat label="Released" value={movie.released} />
              {movie.totalSeasons && <Stat label="Seasons" value={movie.totalSeasons} />}
              {movie.boxOffice && <Stat label="Box Office" value={movie.boxOffice} />}
            </div>

            {movie.awards && (
              <div className="detail__awards">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {movie.awards}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}