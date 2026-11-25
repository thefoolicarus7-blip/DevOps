import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <Link to="/" className="wordmark">
          <svg viewBox="0 0 28 24" aria-hidden="true">
            <rect x="2" y="3" width="5" height="18" rx="1" />
            <rect x="9" y="1" width="5" height="20" rx="1" />
            <rect x="16.5" y="4" width="5" height="17" rx="1" transform="rotate(-12 19 12)" />
            <path d="M0 22.5h28" />
          </svg>
          Shelfnotes
        </Link>
        <nav aria-label="Main">
          <NavLink to="/" end className="topbar__link">
            Library
          </NavLink>
          <NavLink to="/books/new" className="btn btn--small">
            Add a book
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
