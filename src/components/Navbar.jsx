import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Navbar.css";

export function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <img
            className="navbar__logo-icon"
            src={logo}
            alt=""
            aria-hidden="true"
          />
          <span className="navbar__logo-text">
            CINE<em>MATE</em>
          </span>
        </Link>
        <ul className="navbar__links">
          <li>
            <Link
              to="/"
              className={`navbar__link ${pathname === "/" ? "active" : ""}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/movies"
              className={`navbar__link ${pathname.startsWith("/movies") || pathname.startsWith("/movie/") ? "active" : ""}`}
            >
              Movies
            </Link>
          </li>
          <li>
            <Link
              to="/series"
              className={`navbar__link ${pathname === "/series" ? "active" : ""}`}
            >
              Series
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
