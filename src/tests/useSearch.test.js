import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSearch } from "../hooks/useSearch";
import * as api from "../utils/api";

vi.mock("../hooks/useDebounce", () => ({
  useDebounce: (value) => value,
}));

describe("useSearch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sets loading and returns results on success", async () => {
    vi.spyOn(api, "searchMedia").mockResolvedValue({
      items: [{ id: "tt1", rating: "7.0", year: "2010" }],
      totalResults: 1,
    });

    const { result } = renderHook(() => useSearch("inception", "movie"));

    expect(result.current.loading).toBe(true);
    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.results).toHaveLength(1);
    expect(result.current.hasMore).toBe(false);
  });

  it("sets error on failure", async () => {
    vi.spyOn(api, "searchMedia").mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useSearch("inception", "movie"));
    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe("boom");
  });

  it("clears results for short queries", async () => {
    vi.spyOn(api, "searchMedia").mockResolvedValue({ items: [{ id: "tt1" }], totalResults: 1 });

    const { result } = renderHook(() => useSearch("a", "movie"));
    await act(async () => {});

    expect(result.current.results).toEqual([]);
  });

  it("ignores a slow, outdated response", async () => {
    let resolveFirst;
    const first = new Promise((resolve) => {
      resolveFirst = resolve;
    });

    vi.spyOn(api, "searchMedia")
      .mockImplementationOnce(() => first)
      .mockResolvedValueOnce({ items: [{ id: "new" }], totalResults: 1 });

    const { result, rerender } = renderHook(({ q }) => useSearch(q, "movie"), {
      initialProps: { q: "bat" },
    });

    rerender({ q: "batman" });
    await act(async () => {});
    expect(result.current.results[0].id).toBe("new");

    await act(async () => {
      resolveFirst({ items: [{ id: "old" }], totalResults: 1 });
    });
    expect(result.current.results[0].id).toBe("new");
  });

  it("loadMore appends the next page and requests page 2", async () => {
    const searchSpy = vi
      .spyOn(api, "searchMedia")
      .mockResolvedValueOnce({ items: [{ id: "tt1", rating: "5.0" }], totalResults: 2 })
      .mockResolvedValueOnce({ items: [{ id: "tt2", rating: "9.0" }], totalResults: 2 });

    const { result } = renderHook(() => useSearch("batman", "movie"));
    await act(async () => {});

    expect(result.current.hasMore).toBe(true);

    await act(async () => {
      result.current.loadMore();
    });

    expect(result.current.results).toHaveLength(2);
    expect(searchSpy).toHaveBeenLastCalledWith(
      "batman",
      "movie",
      expect.objectContaining({ page: 2 }),
    );
    expect(result.current.hasMore).toBe(false);
  });

  it("sorts by year when sort=year is passed", async () => {
    vi.spyOn(api, "searchMedia").mockResolvedValue({
      items: [
        { id: "old", year: "2005", rating: "9.0" },
        { id: "new", year: "2020", rating: "5.0" },
      ],
      totalResults: 2,
    });

    const { result } = renderHook(() => useSearch("dune", "movie", { sort: "year" }));
    await act(async () => {});

    expect(result.current.results[0].id).toBe("new");
  });
});