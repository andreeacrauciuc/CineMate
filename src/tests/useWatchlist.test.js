import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { WatchlistProvider, useWatchlist } from "../context/WatchlistContext";

const STORAGE_KEY = "cinemate_watchlist";

function createWrapper() {
  return function Wrapper({ children }) {
    return React.createElement(WatchlistProvider, null, children);
  };
}

const movie = {
  id: "tt1375666",
  title: "Inception",
  poster: "https://image.example/inception.jpg",
  rating: "8.8",
  year: "2010",
  type: "movie",
};

const series = {
  id: "tt0903747",
  title: "Breaking Bad",
  poster: "https://image.example/breakingbad.jpg",
  rating: "9.5",
  year: "2008",
  type: "series",
};

describe("useWatchlist", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("adds items and persists them", () => {
    const { result } = renderHook(() => useWatchlist(), { wrapper: createWrapper() });

    act(() => {
      result.current.toggleWatchlist(movie);
    });

    expect(result.current.watchlist).toHaveLength(1);
    expect(result.current.isInWatchlist(movie.id)).toBe(true);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([movie]);
  });

  it("removes items and clears storage when toggled again", () => {
    const { result } = renderHook(() => useWatchlist(), { wrapper: createWrapper() });

    act(() => {
      result.current.toggleWatchlist(movie);
      result.current.toggleWatchlist(movie);
    });

    expect(result.current.watchlist).toHaveLength(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("hydrates from localStorage on mount", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([series]));

    const { result } = renderHook(() => useWatchlist(), { wrapper: createWrapper() });

    expect(result.current.watchlist).toHaveLength(1);
    expect(result.current.watchlist[0].id).toBe(series.id);
  });

  it("deduplicates repeated ids from stored data", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([movie, { ...movie }]));

    const { result } = renderHook(() => useWatchlist(), { wrapper: createWrapper() });

    expect(result.current.watchlist).toHaveLength(1);
    expect(result.current.watchlist[0].id).toBe(movie.id);
  });
});