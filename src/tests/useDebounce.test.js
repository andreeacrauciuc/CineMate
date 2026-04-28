import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../hooks/useDebounce";

describe("useDebounce", () => {
  it("delays value updates by the default 400ms", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "a" },
    });

    expect(result.current).toBe("a");

    rerender({ value: "b" });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("b");

    vi.useRealTimers();
  });
});
