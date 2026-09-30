import { Link } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import { Poster } from "./Poster";
import { BookmarkIcon, StarIcon } from "./Icon";
import { getRecommendation } from "../utils/recommendation";
import "./MovieCard.css";

function StarRating({ rating }) {
  const score = parseFloat(rating);
  const filled = Math.round(score / 2);
  return (
    <span className="movie-card__stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < filled} className={i < filled ? "star-filled" : "star-empty"} />
      ))}
    </span>
  );
}

function RecommendationTag({ rating }) {
  const rec = getRecommendation(rating);
  if (!rec) return null;
  return (
    <span className={`rec-tag rec-tag--${rec.variant}`}>
      {rec.emoji} {rec.label}
    </span>
  );
}

export function MovieCard({ movie, variant = "grid", showStatus = false }) {
  const { isInWatchlist, toggleWatchlist, setWatchStatus } = useWatchlist();
  const saved = isInWatchlist(movie.id);

  const handleToggleWatchlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWatchlist(movie);
  };

    const handleSetStatus = (event, status) => {
    event.preventDefault();
    event.stopPropagation();
    setWatchStatus(movie.id, status);
  };

  return (
    <div className={`movie-card movie-card--${variant}`}>
      <Link to={`/movie/${movie.id}`} className="movie-card__link" aria-label={movie.title} />

      <div className="movie-card__poster-wrap">
        <Poster src={movie.poster} alt={movie.title} className="movie-card__poster" />
        <button
          type="button"
          className={`movie-card__watchlist-btn ${saved ? "is-active" : ""}`}
          onClick={handleToggleWatchlist}
          aria-label={saved ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
          aria-pressed={saved}
          title={saved ? "In watchlist" : "Add to watchlist"}
        >
          <BookmarkIcon filled={saved} />
        </button>
        <div className="movie-card__type-badge">{movie.type}</div>
      </div>

      <div className="movie-card__body">
        <div className="movie-card__top">
          <h3 className="movie-card__title">{movie.title}</h3>
          <div className="movie-card__meta">
            <span className="movie-card__year">{movie.year}</span>
            {movie.runtime && <span className="movie-card__runtime">· {movie.runtime}</span>}
            {movie.genre && <span className="movie-card__genre">· {movie.genre.split(",")[0]}</span>}
          </div>
        </div>

        {movie.rating && (
          <div className="movie-card__rating-row">
            <span className="movie-card__score">
              ★ {movie.rating}
              <span className="movie-card__score-max"> /10</span>
            </span>
            <StarRating rating={movie.rating} />
          </div>
        )}

                {movie.plot && <p className="movie-card__plot">{movie.plot}</p>}

        {showStatus ? (
          <div className="movie-card__status" role="group" aria-label="Watch status">
                        <button
              type="button"
              className={`movie-card__status-btn movie-card__status-btn--towatch ${movie.status !== "watched" ? "is-active" : ""}`}
              onClick={(e) => handleSetStatus(e, "to_watch")}
            >
              To watch
            </button>
            <button
              type="button"
              className={`movie-card__status-btn movie-card__status-btn--watched ${movie.status === "watched" ? "is-active" : ""}`}
              onClick={(e) => handleSetStatus(e, "watched")}
            >
              Watched
            </button>
          </div>
        ) : (
          <RecommendationTag rating={movie.rating} />
        )}
      </div>
    </div>
  );
}