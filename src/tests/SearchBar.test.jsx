import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "../components/SearchBar";

describe("SearchBar", () => {
  it("submits trimmed input", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={onSearch} placeholder="Search…" />);

    const input = screen.getByPlaceholderText("Search…");
    await user.type(input, "  batman  ");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith("batman");
  });

  it("clears input and triggers empty search", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={onSearch} initialValue="matrix" />);

    const clearButton = screen.getByRole("button", { name: /clear/i });
    await user.click(clearButton);

    expect(onSearch).toHaveBeenCalledWith("");
  });
});
