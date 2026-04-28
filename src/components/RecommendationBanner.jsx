import "./RecommendationBanner.css";

function getRecommendation(imdbRating) {
  if (!imdbRating || imdbRating === "N/A") return null;
  const score = parseFloat(imdbRating) * 10;

  if (score > 80) {
    return {
      emoji: "🔥",
      message: "You should watch this movie right now!",
      variant: "hot",
      score,
    };
  } else if (score < 50) {
    return {
      emoji: "🚫",
      message: "Avoid this movie at all costs!",
      variant: "avoid",
      score,
    };
  } else {
    return {
      emoji: "🤔",
      message: "This movie might be worth watching.",
      variant: "maybe",
      score,
    };
  }
}

export function RecommendationBanner({ imdbRating }) {
  const rec = getRecommendation(imdbRating);
  if (!rec) return null;

  return (
    <div className={`rec-banner rec-banner--${rec.variant}`}>
      <div className="rec-banner__bar">
        <div className="rec-banner__fill" style={{ width: `${rec.score}%` }} />
      </div>
      <div className="rec-banner__content">
        <div className="rec-banner__left">
          <span className="rec-banner__emoji">{rec.emoji}</span>
          <span className="rec-banner__message">{rec.message}</span>
        </div>
        <div className="rec-banner__score">
          <span className="rec-banner__score-num">{Math.round(rec.score)}</span>
          <span className="rec-banner__score-label">/ 100</span>
        </div>
      </div>
    </div>
  );
}
