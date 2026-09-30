const VARIANTS = {
  hot: { emoji: "🔥", label: "Must watch" },
  maybe: { emoji: "🎬", label: "Decent watch" },
  avoid: { emoji: "🚫", label: "Skip it" },
};

export function getRecommendation(rating) {
  if (!rating || rating === "N/A") return null;
  const score = parseFloat(rating) * 10;
  if (Number.isNaN(score)) return null;

  let variant = "maybe";
  if (score > 80) variant = "hot";
  else if (score < 50) variant = "avoid";

  return { ...VARIANTS[variant], variant, score };
}

export function getRecommendationMessage(variant, type = "movie") {
  const noun = type === "series" ? "series" : "movie";
  switch (variant) {
    case "hot":
      return `You should watch this ${noun} right now!`;
    case "avoid":
      return `Avoid this ${noun} at all costs!`;
    default:
      return `This ${noun} might be worth watching.`;
  }
}