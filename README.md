# CineMate

A movie and TV series discovery app built with React and the OMDb API. Search titles, keep a personal watchlist with a watched/to-watch status, and see a rating-based recommendation.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

**Live demo:** <https://cinemate-ashy.vercel.app/>

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)
- [License](#license)

## Features

- Debounced search (400ms) across movies and series, with a year filter and sorting by rating or release year
- Search state (query, filters, sort, pagination) kept in the URL, so results are shareable and work with the browser's back/forward buttons
- "Load more" pagination on top of OMDb's paginated search results
- In-flight requests are cancelled via `AbortController` when the query changes, preventing an outdated response from overwriting a newer one
- Personal watchlist stored in `localStorage`: mark titles as "To watch" or "Watched", filter by movies/series, sort by date added, rating, or release year, and view aggregate stats (saved count, watched count, average rating)
- Rating-based recommendation tags on cards and detail pages
- Response caching (1-hour TTL, case-insensitive keys) to reduce redundant API calls, with a distinct error message when OMDb's daily rate limit is reached
- Skeleton loaders, error states, and an empty-state view for searches with no results
- Responsive, mobile-first layout

## Tech Stack

| Layer      | Technology                      |
| ---------- | -------------------------------- |
| Framework  | React 18 + Vite                  |
| Routing    | React Router 7                   |
| Styling    | Plain CSS (custom properties, BEM-style naming) |
| Testing    | Vitest + React Testing Library   |
| Data       | [OMDb API](https://www.omdbapi.com/) |
| Deployment | Vercel                           |

## Getting Started

### Prerequisites

- Node.js 18+
- A free OMDb API key: https://www.omdbapi.com/apikey.aspx

### Installation

```bash
git clone <repo-url>
cd cinemate
npm install
cp .env.example .env
```

### Environment Variables

| Variable            | Required | Notes                                             |
| -------------------- | :------: | -------------------------------------------------- |
| `VITE_OMDB_API_KEY`  |   Yes    | OMDb API key. Bundled into the client JS — fine for a free-tier key, not for a sensitive one. |

### Running the app

```bash
npm run dev
```

Open http://localhost:5173.

## Available Scripts

| Script            | Description                          |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Starts the development server         |
| `npm run build`    | Builds the app for production         |
| `npm run preview`  | Serves the production build locally   |
| `npm run test`     | Runs the test suite with Vitest       |

## Testing

```bash
npm run test
```

Test coverage includes the API/cache layer (cache key normalization, rate-limit handling), the search hook (debounce, pagination, discarding outdated responses), the debounce hook, the watchlist context, and select components. Page-level components (`Watchlist`, `MediaBrowser`) are not yet covered.

## Project Structure

```text
src/
├── components/
│   ├── ErrorMessage        # Error message and empty-state view
│   ├── Icon                # Shared bookmark/star SVG icons
│   ├── Loader              # Spinner and skeleton grid
│   ├── MovieCard            # Poster, rating, recommendation tag or watch-status toggle
│   ├── MovieGrid              # Responsive grid of MovieCard
│   ├── Navbar                   # Navigation bar with a live watchlist count
│   ├── Poster                     # <img> with a local SVG fallback on load error
│   ├── RecommendationBanner
│   └── SearchBar
├── context/
│   └── WatchlistContext     # Watchlist state, watch status, cross-tab localStorage sync
├── hooks/
│   ├── useDebounce
│   ├── useMovie              # Single movie/series detail fetch
│   └── useSearch               # Search, pagination, sorting, request cancellation
├── pages/
│   ├── Home
│   ├── MediaBrowser            # Shared search/filter/sort/pagination UI for Movies and Series
│   ├── Movies / Series           # Thin wrappers around MediaBrowser
│   ├── MovieDetails
│   └── Watchlist
├── utils/
│   ├── api.js                  # OMDb fetch, response cache, rate-limit handling
│   ├── normalizeMedia.js         # Maps raw OMDb fields to one internal data model
│   ├── poster.js
│   └── recommendation.js           # Rating thresholds shared by the card and the banner
└── styles/
    └── globals.css
```

## Known Limitations

- Each search enriches up to 10 results with a follow-up detail request per title, so one search can use up to 11 API calls. OMDb's free tier allows 1,000 requests/day.
- No linter or CI pipeline configured yet.
- The catch-all route redirects to Home instead of showing a dedicated "not found" page.

## License

MIT