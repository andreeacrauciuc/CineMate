import emptyIcon from "../../assets/icon.svg";
import "./ErrorMessage.css";

export function ErrorMessage({ message }) {
  return (
    <div className="error-msg">
      <span className="error-msg__icon">⚠</span>
      <p className="error-msg__text">
        {message || "Something went wrong. Please try again."}
      </p>
    </div>
  );
}

export function EmptyState({ query, type = "results" }) {
  return (
    <div className="empty-state">
      <img
        className="empty-state__icon"
        src={emptyIcon}
        alt=""
        aria-hidden="true"
      />
      <h3 className="empty-state__title">
        {query ? `No ${type} found for "${query}"` : `Search for ${type}`}
      </h3>
      <p className="empty-state__desc">
        {query
          ? "Try a different title or check your spelling."
          : `Enter a title above to discover ${type}.`}
      </p>
    </div>
  );
}
