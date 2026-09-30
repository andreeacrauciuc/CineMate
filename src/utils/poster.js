const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="440" viewBox="0 0 300 440">
  <rect width="300" height="440" fill="#e8e6df"/>
  <text x="150" y="225" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#9a9a9a">No poster</text>
</svg>`;

export const FALLBACK_POSTER = `data:image/svg+xml,${encodeURIComponent(svg)}`;

export function handlePosterError(e) {
  const img = e.currentTarget;
  if (img.src === FALLBACK_POSTER) return;
  img.src = FALLBACK_POSTER;
}