import { MovieCard } from "./MovieCard";
import "./MovieGrid.css";

export function MovieGrid({ items, showStatus = false }) {
  return (
    <div className="movie-grid">
      {items.map((item, i) => (
        <div key={item.id} style={{ animationDelay: `${i * 0.05}s` }}>
          <MovieCard movie={item} showStatus={showStatus} />
        </div>
      ))}
    </div>
  );
}