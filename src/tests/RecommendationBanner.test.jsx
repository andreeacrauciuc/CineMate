import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecommendationBanner } from "../components/RecommendationBanner";

describe("RecommendationBanner", () => {
  it("renders hot recommendation for high ratings", () => {
    render(<RecommendationBanner imdbRating="8.6" />);
    expect(screen.getByText(/should watch/i)).toBeInTheDocument();
  });

  it("renders avoid recommendation for low ratings", () => {
    render(<RecommendationBanner imdbRating="4.0" />);
    expect(screen.getByText(/avoid/i)).toBeInTheDocument();
  });

  it("renders maybe recommendation for mid ratings", () => {
    render(<RecommendationBanner imdbRating="6.0" />);
    expect(screen.getByText(/might be worth/i)).toBeInTheDocument();
  });

  it("renders nothing when rating is missing", () => {
    const { container } = render(<RecommendationBanner imdbRating="N/A" />);
    expect(container.firstChild).toBeNull();
  });
});
