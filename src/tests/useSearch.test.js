import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useSearch from "../hooks/useSearch";
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
      Search: [{ imdbID: "tt1" }],
    });

    const { result } = renderHook(() => useSearch("inception", "movie"));

    expect(result.current.loading).toBe(true);
    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.results).toHaveLength(1);
  });

  it("sets error on failure", async () => {
    vi.spyOn(api, "searchMedia").mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useSearch("inception", "movie"));

    expect(result.current.loading).toBe(true);
    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe("boom");
  });

  it("clears results for short queries", async () => {
    vi.spyOn(api, "searchMedia").mockResolvedValue({
      Search: [{ imdbID: "tt1" }],
    });

    const { result } = renderHook(() => useSearch("a", "movie"));
    await act(async () => {});

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
