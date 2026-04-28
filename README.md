# 🎬 CineMate

A production-grade Movie & Series recommendation Single Page Application (SPA) built with React and Vite. 
Features a custom caching layer, debounced API requests, and a modern cinematic UI.

Live Demo: 

## ✨Features
- Smart search: debounced input (400ms) to prevent unnecessary API calls and rate limiting
- Performance optimized: custom `localStorage` caching mechanism with a 1-hour TTL (Time-To-Live)
- Intelligent recommendations: rating-based algorithmic tags (🔥 Hot / 🤔 Maybe / 🚫 Avoid)
- Resilient UI: skeleton loaders, graceful error handling, and animated empty states
- Responsive design: mobile-first architecture with a dark cinematic design system
- Unit tested: core hooks, utils, and components are fully tested

## 🛠️ Tech Stack
- Framework: React 18 + Vite
- Routing: React Router v7
- Styling: Pure CSS3 (CSS variables, Flexbox/Grid, BEM methodology)
- Testing: Vitest + React Testing Library + user-event
- API: OMDb API

## Setup & Installation

### 1. Get your OMDb API Key
Sign up free at https://www.omdbapi.com/apikey.aspx

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and add your key:
# VITE_OMDB_API_KEY=your_key_here
```

### 3. Install & run
```bash
npm install
npm run dev
```

Open http://localhost:5173

### Build for production
```bash
npm run build
npm run preview
```

## 🧪 Testing
# Run unit tests
npm run test

## 🏗️ Architecture overview

```
src/
├── components/
│   ├── Navbar           # Sticky navigation
│   ├── SearchBar        # Reusable debounced search input
│   ├── MovieCard        # Card with poster, title, year, rating
│   ├── MovieGrid        # Responsive grid layout
│   ├── Loader           # Spinner + Skeleton grid
│   ├── ErrorMessage     # Error + EmptyState components
│   └── RecommendationBanner  # Rating-based recommendation
├── assets/
│   ├── icon.svg          # Empty state icon
│   └── logo.svg          # Navbar logo
├── hooks/
│   ├── useDebounce      # Generic debounce hook
│   ├── useSearch        # Core search logic (shared)
│   ├── useMovies        # Movies search (uses useSearch)
│   ├── useSeries        # Series search (uses useSearch)
│   └── useMovie         # Single movie/series detail
├── pages/
│   ├── Home             # Landing page with hero + quick search
│   ├── MediaBrowser     # Shared Movies/Series page (no duplication)
│   ├── Movies           # Thin wrapper → MediaBrowser
│   ├── Series           # Thin wrapper → MediaBrowser
│   └── MovieDetails     # Full detail + recommendation
├── utils/
│   └── api.js           # OMDb fetch + localStorage cache (1hr TTL)
└── styles/
    └── globals.css      # Design system, CSS variables, animations
```


