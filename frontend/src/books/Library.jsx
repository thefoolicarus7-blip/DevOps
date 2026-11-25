import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api";
import Cover from "./Cover";
import { Stars } from "./Stars";
import { averageRating, reviewCount } from "./bookUtils";

const SORTS = {
  rating: { label: "Highest rated", fn: (a, b) => b.avg - a.avg || b.count - a.count },
  reviews: { label: "Most reviewed", fn: (a, b) => b.count - a.count },
  newest: { label: "Recently added", fn: (a, b) => (b.createdAt || "").localeCompare(a.createdAt || "") },
  title: { label: "Title A–Z", fn: (a, b) => a.title.localeCompare(b.title) },
};

const Library = () => {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("rating");

  const [attempt, setAttempt] = useState(0); // bump to retry loading

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/book");
        setBooks(data.result);
        setStatus("ready");
      } catch (err) {
        setError(errorMessage(err));
        setStatus("error");
      }
    };
    load();
  }, [attempt]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books
      .map((b) => ({ ...b, avg: averageRating(b.reviews), count: b.reviews?.length || 0 }))
      .filter(
        (b) =>
          !q ||
          b.title.toLowerCase().includes(q) ||
          (b.author || "").toLowerCase().includes(q) ||
          (b.genre || "").toLowerCase().includes(q),
      )
      .sort(SORTS[sort].fn);
  }, [books, query, sort]);

  const totalReviews = books.reduce((n, b) => n + (b.reviews?.length || 0), 0);

  return (
    <main className="page">
      <header className="library-head">
        <div>
          <h1 className="display">The reading shelf</h1>
          <p className="lede">
            Browse what's been read, see what readers thought, and leave a review
            of your own.
          </p>
        </div>
        {status === "ready" && books.length > 0 && (
          <p className="library-head__count">
            {books.length === 1 ? "1 book" : `${books.length} books`} on the shelf,{" "}
            {reviewCount(totalReviews)} so far.
          </p>
        )}
      </header>

      {status === "ready" && books.length > 0 && (
        <div className="toolbar">
          <label className="search">
            <span className="sr-only">Search books</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="Search by title, author or genre"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label className="sort">
            <span>Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(SORTS).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {status === "loading" && <p className="notice">Loading the shelf…</p>}

      {status === "error" && (
        <div className="notice notice--error">
          <p>{error}</p>
          <button
            className="btn btn--quiet"
            onClick={() => {
              setStatus("loading");
              setAttempt((n) => n + 1);
            }}
          >
            Try again
          </button>
        </div>
      )}

      {status === "ready" && books.length === 0 && (
        <div className="empty">
          <h2>The shelf is empty</h2>
          <p>Add the first book, then you and other readers can start reviewing it.</p>
          <Link to="/books/new" className="btn">
            Add a book
          </Link>
        </div>
      )}

      {status === "ready" && books.length > 0 && shown.length === 0 && (
        <p className="notice">
          No books match “{query}”. Try a different title or author.
        </p>
      )}

      {shown.length > 0 && (
        <ul className="shelf">
          {shown.map((book) => (
            <li key={book._id} className="shelf__item">
              <Link to={`/books/${book._id}`} className="book-card">
                <div className="shelf__slot">
                  <Cover title={book.title} author={book.author} />
                </div>
                <h2 className="book-card__title">{book.title}</h2>
                {book.author && <p className="book-card__author">{book.author}</p>}
                <p className="book-card__rating">
                  <Stars value={book.avg} />
                  <span>{book.count ? `${book.avg.toFixed(1)} (${book.count})` : "No reviews yet"}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default Library;
