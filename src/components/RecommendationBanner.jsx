import { getRecommendation, getRecommendationMessage } from "../utils/recommendation";
import "./RecommendationBanner.css";

export function RecommendationBanner({ rating, type = "movie" }) {
  const rec = getRecommendation(rating);
  if (!rec) return null;

  return (
    <div className={`rec-banner rec-banner--${rec.variant}`}>
      <div className="rec-banner__bar">
        <div className="rec-banner__fill" style={{ width: `${rec.score}%` }} />
      </div>
      <div className="rec-banner__content">
        <div className="rec-banner__left">
          <span className="rec-banner__emoji">{rec.emoji}</span>
          <span className="rec-banner__message">{getRecommendationMessage(rec.variant, type)}</span>
        </div>
        <div className="rec-banner__score">
          <span className="rec-banner__score-num">{Math.round(rec.score)}</span>
          <span className="rec-banner__score-label">/ 100</span>
        </div>
      </div>
    </div>
  );
}