import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { errorMessage } from "../api";
import Cover from "./Cover";
import { StarPicker, Stars } from "./Stars";
import { averageRating, formatDate, formatPrice, reviewCount } from "./bookUtils";

const emptyReview = { reviewer: "", rating: 0, comment: "" };

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [review, setReview] = useState(emptyReview);
  const [formError, setFormError] = useState("");
  const [posting, setPosting] = useState(false);
  const [justPosted, setJustPosted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/book/${id}`);
        if (!data.result) throw new Error();
        setBook(data.result);
        setStatus("ready");
      } catch (err) {
        setError(err.response ? errorMessage(err) : "This book isn't on the shelf any more.");
        setStatus("error");
      }
    };
    load();
  }, [id]);

  const postReview = async (e) => {
    e.preventDefault();
    if (!review.reviewer.trim()) return setFormError("Add your name so readers know who wrote this.");
    if (!review.rating) return setFormError("Pick a star rating from 1 to 5.");
    setFormError("");
    setPosting(true);
    try {
      const { data } = await api.post(`/book/${id}/reviews`, review);
      setBook(data.result);
      setReview(emptyReview);
      setJustPosted(true);
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setPosting(false);
    }
  };

  const deleteBook = async () => {
    try {
      await api.delete(`/book/${id}`);
      navigate("/");
    } catch (err) {
      setError(errorMessage(err));
      setConfirmDelete(false);
    }
  };

  if (status === "loading") return <main className="page"><p className="notice">Loading…</p></main>;
  if (status === "error")
    return (
      <main className="page">
        <div className="notice notice--error">
          <p>{error}</p>
          <Link to="/" className="btn btn--quiet">Back to the shelf</Link>
        </div>
      </main>
    );

  const reviews = [...book.reviews].reverse();
  const avg = averageRating(book.reviews);
  const counts = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: book.reviews.filter((r) => Number(r.rating) === n).length,
  }));
  const inStock = Number(book.stock) > 0;

  return (
    <main className="page">
      <Link to="/" className="back-link">Back to the shelf</Link>

      <article className="book">
        <div className="book__cover">
          <Cover title={book.title} author={book.author} size="lg" />
        </div>

        <div className="book__body">
          {book.genre && <p className="book__genre">{book.genre}</p>}
          <h1 className="book__title">{book.title}</h1>
          {book.author && <p className="book__author">by {book.author}</p>}

          <p className="book__rating">
            <Stars value={avg} size="md" />
            <span>
              {book.reviews.length ? `${avg.toFixed(1)} from ${reviewCount(book.reviews.length)}` : "No reviews yet"}
            </span>
          </p>

          {book.description && <p className="book__description">{book.description}</p>}

          <dl className="facts">
            {book.publication && (
              <div>
                <dt>Publisher</dt>
                <dd>{book.publication}</dd>
              </div>
            )}
            <div>
              <dt>Price</dt>
              <dd>{formatPrice(book.price)}</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd className={inStock ? "" : "is-out"}>
                {inStock ? `${book.stock} in stock` : "Out of stock"}
              </dd>
            </div>
          </dl>

          <div className="book__actions">
            {confirmDelete ? (
              <div className="confirm" role="alert">
                <p>Delete “{book.title}” and all its reviews? This can't be undone.</p>
                <button className="btn btn--danger" onClick={deleteBook}>Delete book</button>
                <button className="btn btn--quiet" onClick={() => setConfirmDelete(false)}>Keep it</button>
              </div>
            ) : (
              <>
                <Link to={`/books/${id}/edit`} className="btn btn--quiet">Edit details</Link>
                <button className="btn btn--text" onClick={() => setConfirmDelete(true)}>Delete book</button>
              </>
            )}
          </div>
        </div>
      </article>

      <section className="reviews" aria-labelledby="reviews-heading">
        <div className="reviews__side">
          <h2 id="reviews-heading" className="section-title">Reader reviews</h2>
          {book.reviews.length > 0 && (
            <ul className="breakdown" aria-label="Ratings breakdown">
              {counts.map(({ n, count }) => (
                <li key={n}>
                  <span>{n} star</span>
                  <span className="breakdown__bar">
                    <span style={{ width: `${(count / book.reviews.length) * 100}%` }} />
                  </span>
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          )}

          <form className="review-form" onSubmit={postReview} noValidate>
            <h3>Write a review</h3>
            <StarPicker
              value={review.rating}
              onChange={(rating) => {
                setReview({ ...review, rating });
                setJustPosted(false);
              }}
            />
            <label className="field">
              <span>Your name</span>
              <input
                type="text"
                value={review.reviewer}
                onChange={(e) => {
                  setReview({ ...review, reviewer: e.target.value });
                  setJustPosted(false);
                }}
              />
            </label>
            <label className="field">
              <span>What did you think? <em>Optional</em></span>
              <textarea
                rows="4"
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
              />
            </label>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            {justPosted && <p className="form-success" role="status">Review posted. Thanks for sharing.</p>}
            <button className="btn" type="submit" disabled={posting}>
              {posting ? "Posting…" : "Post review"}
            </button>
          </form>
        </div>

        <div className="reviews__list">
          {reviews.length === 0 ? (
            <p className="empty-reviews">
              Nobody has reviewed this book yet. Yours could be the first.
            </p>
          ) : (
            <ul>
              {reviews.map((r) => (
                <li key={r._id} className="review">
                  <div className="review__head">
                    <span className="review__avatar" aria-hidden="true">
                      {r.reviewer.trim().charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="review__name">{r.reviewer}</p>
                      <p className="review__meta">
                        <Stars value={Number(r.rating)} />
                        <time dateTime={r.createdAt}>{formatDate(r.createdAt)}</time>
                      </p>
                    </div>
                  </div>
                  {r.comment && <p className="review__text">{r.comment}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
};

export default BookDetail;
