import "./Loader.css";

export function Loader({ text = "Loading…" }) {
  return (
    <div className="loader">
      <div className="loader__spinner" />
      <p className="loader__text">{text}</p>
    </div>
  );
}

export function SkeletonGrid({ count = 10 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-poster shimmer" />
          <div className="skeleton-info">
            <div className="skeleton-line shimmer" />
            <div className="skeleton-line short shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
