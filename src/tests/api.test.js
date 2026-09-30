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

  it("treats keys as case-insensitive", () => {
    const now = 1_000_000;
    vi.spyOn(Date, "now").mockReturnValue(now);
    cache.set("Batman", { ok: true });

    expect(cache.get("batman")).toEqual({ ok: true });
  });
});

describe("utils/api searchMedia", () => {
  const fetchMock = vi.fn(async (url) => {
    const u = new URL(url);
    if (u.searchParams.get("s")) {
      return {
        ok: true,
        json: async () => ({
          Response: "True",
          totalResults: "1",
          Search: [{ imdbID: "tt1", Title: "Inception", Year: "2010", Type: "movie" }],
        }),
      };
    }
    if (u.searchParams.get("i")) {
      return {
        ok: true,
        json: async () => ({
          Response: "True",
          imdbID: "tt1",
          Title: "Inception",
          imdbRating: "8.0",
          Plot: "Plot",
          Type: "movie",
        }),
      };
    }
    return { ok: false, status: 404, json: async () => ({}) };
  });

  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns enriched, normalized results with a total count", async () => {
    const result = await searchMedia("inception", "movie");
    expect(result.totalResults).toBe(1);
    expect(result.items[0].id).toBe("tt1");
    expect(result.items[0].rating).toBe("8.0");
  });

  it("uses cache on subsequent calls without refetching", async () => {
    await searchMedia("inception", "movie");
    fetchMock.mockClear();

    await searchMedia("inception", "movie");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the year filter to OMDb when provided", async () => {
    await searchMedia("inception", "movie", { year: "2010" });

    const calledUrl = fetchMock.mock.calls.find(([url]) => url.includes("s=inception"))[0];
    expect(new URL(calledUrl).searchParams.get("y")).toBe("2010");
  });

  it("caches page 1 and page 2 separately", async () => {
    await searchMedia("inception", "movie", { page: 1 });
    expect(cache.get("search_movie_inception_1_any")).toBeTruthy();
    expect(cache.get("search_movie_inception_2_any")).toBeNull();
  });

  it("throws a clear error when the request limit is reached", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 401,
        json: async () => ({ Response: "False", Error: "Request limit reached!" }),
      })),
    );

    await expect(searchMedia("batman", "movie")).rejects.toThrow(/limit/i);
  });
});