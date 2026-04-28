import { useMovies } from "../hooks/useMovies";
import { MediaBrowser } from "./MediaBrowser";

export function Movies() {
  return (
    <MediaBrowser
      useHook={useMovies}
      type="movie"
      label="Movies"
      placeholder="Search for a movie…"
    />
  );
}
