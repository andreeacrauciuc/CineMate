import { useParams, useNavigate } from "react-router-dom";
import { useMovie } from "../hooks/useMovie";
import { RecommendationBanner } from "../components/RecommendationBanner";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import "./MovieDetails.css";

const FALLBACK =
  "https://via.placeholder.com/400x600/111827/4a5568?text=No+Poster";

function Badge({ children }) {
  return <span className="detail-badge">{children}</span>;
}

function Stat({ label, value }) {
  if (!value || value === "N/A") return null;
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

  const poster = movie.Poster !== "N/A" ? movie.Poster : FALLBACK;
  const genres = movie.Genre?.split(", ") || [];

  return (
    <main className="detail page-enter">
      {/* Blurred poster BG */}
      <div
        className="detail__bg-poster"
        style={{ backgroundImage: `url(${poster})` }}
        aria-hidden="true"
      >
        <div className="detail__bg-overlay" />
      </div>

      <div className="container">
        {/* Back button */}
        <button className="detail__back" onClick={() => navigate(-1)}>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>

        <div className="detail__layout">
          {/* Poster */}
          <aside className="detail__poster-col">
            <div className="detail__poster-wrap">
              <img
                src={poster}
                alt={movie.Title}
                className="detail__poster"
                onError={(e) => {
                  e.target.src = FALLBACK;
                }}
              />
            </div>

            {movie.imdbRating && movie.imdbRating !== "N/A" && (
              <div className="detail__imdb">
                <div className="detail__imdb-top">
                  <span className="detail__imdb-star">★</span>
                  <span className="detail__imdb-score">{movie.imdbRating}</span>
                  <span className="detail__imdb-max">/10</span>
                </div>
                {movie.imdbVotes && movie.imdbVotes !== "N/A" && (
                  <p className="detail__imdb-votes">{movie.imdbVotes} votes</p>
                )}
              </div>
            )}
          </aside>

          <section className="detail__info">
            <div className="detail__meta">
              <span className="detail__type">{movie.Type}</span>
              {movie.Year && <span className="detail__year">{movie.Year}</span>}
              {movie.Rated && movie.Rated !== "N/A" && (
                <span className="detail__rated">{movie.Rated}</span>
              )}
            </div>

            <h1 className="detail__title">{movie.Title}</h1>

            {genres.length > 0 && (
              <div className="detail__genres">
                {genres.map((g) => (
                  <Badge key={g}>{g}</Badge>
                ))}
              </div>
            )}

            {movie.Plot && movie.Plot !== "N/A" && (
              <p className="detail__plot">{movie.Plot}</p>
            )}

            <RecommendationBanner imdbRating={movie.imdbRating} />

            <div className="detail__stats">
              <Stat label="Director" value={movie.Director} />
              <Stat label="Cast" value={movie.Actors} />
              <Stat label="Runtime" value={movie.Runtime} />
              <Stat label="Language" value={movie.Language} />
              <Stat label="Country" value={movie.Country} />
              <Stat label="Released" value={movie.Released} />
              {movie.totalSeasons && (
                <Stat label="Seasons" value={movie.totalSeasons} />
              )}
              {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
                <Stat label="Box Office" value={movie.BoxOffice} />
              )}
            </div>

            {movie.Awards && movie.Awards !== "N/A" && (
              <div className="detail__awards">
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {movie.Awards}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
