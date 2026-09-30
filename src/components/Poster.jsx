import { FALLBACK_POSTER, handlePosterError } from "../utils/poster";

export function Poster({ src, alt, className, ...props }) {
  return (
    <img
      src={src || FALLBACK_POSTER}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handlePosterError}
      {...props}
    />
  );
}