import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Movies } from "./pages/Movies";
import { Series } from "./pages/Series";
import { MovieDetails } from "./pages/MovieDetails";
import { Watchlist } from "./pages/Watchlist";
import { WatchlistProvider } from "./context/WatchlistContext";
import "./styles/globals.css";

function App() {
  return (
    <BrowserRouter>
      <WatchlistProvider>
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </WatchlistProvider>
    </BrowserRouter>
  );
}

export default App;
