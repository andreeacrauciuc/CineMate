import { MovieCard } from "./MovieCard";
import "./MovieGrid.css";

export function MovieGrid({ items }) {
  return (
    <div className="movie-grid">
      {items.map((item, i) => (
        <div key={item.imdbID} style={{ animationDelay: `${i * 0.05}s` }}>
          <MovieCard movie={item} />
        </div>
      ))}
    </div>
  );
}
