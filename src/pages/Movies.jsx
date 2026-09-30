import { MediaBrowser } from "./MediaBrowser";

export function Movies() {
  return <MediaBrowser type="movie" label="Movies" placeholder="Search for a movie…" />;
}