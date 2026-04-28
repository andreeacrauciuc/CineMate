import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { cache, searchMedia } from "../utils/api";

describe("utils/api cache", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("stores and returns cached data within TTL", () => {
    const now = 1_000_000;
    vi.spyOn(Date, "now").mockReturnValue(now);
    cache.set("test", { ok: true });

    const result = cache.get("test");
    expect(result).toEqual({ ok: true });
  });

  it("expires cached data after TTL", () => {
    const now = 1_000_000;
    vi.spyOn(Date, "now").mockReturnValue(now);
    cache.set("test", { ok: true });

    vi.spyOn(Date, "now").mockReturnValue(now + 60 * 60 * 1000 + 1);
    const result = cache.get("test");
    expect(result).toBeNull();
  });
});

describe("utils/api searchMedia", () => {
  const fetchMock = vi.fn(async (url) => {
    const u = new URL(url);
    if (u.searchParams.get("s")) {
      return {
        ok: true,
        json: async () => ({ Response: "True", Search: [{ imdbID: "tt1" }] }),
      };
    }
    if (u.searchParams.get("i")) {
      return {
        ok: true,
        json: async () => ({
          Response: "True",
          imdbID: "tt1",
          imdbRating: "8.0",
          Plot: "Plot",
        }),
      };
    }
    return { ok: false, json: async () => ({}) };
  });

  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns enriched results and caches them", async () => {
    const result = await searchMedia("inception", "movie");
    expect(result.Search[0].imdbRating).toBe("8.0");

    const cached = cache.get("search_movie_inception_1");
    expect(cached).toBeTruthy();
  });

  it("uses cache on subsequent calls without refetching", async () => {
    await searchMedia("inception", "movie");
    fetchMock.mockClear();

    await searchMedia("inception", "movie");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
