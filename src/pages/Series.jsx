import { useSeries } from "../hooks/useSeries";
import { MediaBrowser } from "./MediaBrowser";

export function Series() {
  return (
    <MediaBrowser
      useHook={useSeries}
      type="series"
      label="Series"
      placeholder="Search for a TV series…"
    />
  );
}
