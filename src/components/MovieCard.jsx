import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

const FALLBACK =
  "https://via.placeholder.com/300x440/e8e6df/9a9a9a?text=No+Poster";

function StarRating({ rating }) {
  const score = parseFloat(rating);
  const filled = Math.round(score / 2);
  return (
    <span className="movie-card__stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width="13"
          height="13"
          fill={i < filled ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          className={i < filled ? "star-filled" : "star-empty"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function RecommendationTag({ rating }) {
  if (!rating || rating === "N/A") return null;
  const score = parseFloat(rating) * 10;
  if (score > 80)
    return <span className="rec-tag rec-tag--hot">🔥 Must watch</span>;
  if (score < 50)
    return <span className="rec-tag rec-tag--avoid">🚫 Skip it</span>;
  return <span className="rec-tag rec-tag--maybe">🎬 Decent watch</span>;
}

export function MovieCard({ movie, variant = "grid" }) {
  const navigate = useNavigate();
  const poster =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : FALLBACK;
  const rating =
    movie.imdbRating && movie.imdbRating !== "N/A" ? movie.imdbRating : null;
  const hasDesc = movie.Plot && movie.Plot !== "N/A";

  return (
    <div
      className={`movie-card movie-card--${variant}`}
      onClick={() => navigate(`/movie/${movie.imdbID}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/movie/${movie.imdbID}`)}
    >
      <div className="movie-card__poster-wrap">
        <img
          src={poster}
          alt={movie.Title}
          className="movie-card__poster"
          loading="lazy"
          onError={(e) => {
            e.target.src = FALLBACK;
          }}
        />
        <div className="movie-card__type-badge">{movie.Type || "movie"}</div>
      </div>

      <div className="movie-card__body">
        <div className="movie-card__top">
          <h3 className="movie-card__title">{movie.Title}</h3>
          <div className="movie-card__meta">
            <span className="movie-card__year">{movie.Year}</span>
            {movie.Runtime && movie.Runtime !== "N/A" && (
              <span className="movie-card__runtime">· {movie.Runtime}</span>
            )}
            {movie.Genre && movie.Genre !== "N/A" && (
              <span className="movie-card__genre">
                · {movie.Genre.split(",")[0]}
              </span>
            )}
          </div>
        </div>

        {rating && (
          <div className="movie-card__rating-row">
            <span className="movie-card__score">
              ★ {rating}
              <span className="movie-card__score-max"> /10</span>
            </span>
            <StarRating rating={rating} />
          </div>
        )}

        {hasDesc && <p className="movie-card__plot">{movie.Plot}</p>}

        <RecommendationTag rating={rating} />
      </div>
    </div>
  );
}