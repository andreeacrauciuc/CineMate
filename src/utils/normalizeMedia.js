function clean(value) {
  return value && value !== "N/A" ? value : null;
}

export function normalizeMedia(raw) {
  if (!raw || !raw.imdbID) return null;

  return {
    id: raw.imdbID,
    title: clean(raw.Title) || "Untitled",
    year: clean(raw.Year),
    poster: clean(raw.Poster),
    rating: clean(raw.imdbRating),
    votes: clean(raw.imdbVotes),
    type: raw.Type === "series" ? "series" : "movie",
    genre: clean(raw.Genre),
    runtime: clean(raw.Runtime),
    rated: clean(raw.Rated),
    plot: clean(raw.Plot),
    director: clean(raw.Director),
    actors: clean(raw.Actors),
    language: clean(raw.Language),
    country: clean(raw.Country),
    released: clean(raw.Released),
    totalSeasons: clean(raw.totalSeasons),
    boxOffice: clean(raw.BoxOffice),
    awards: clean(raw.Awards),
  };
}