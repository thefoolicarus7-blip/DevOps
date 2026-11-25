import { useState } from "react";

const STAR_PATH =
  "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";

const Star = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={STAR_PATH} />
  </svg>
);

// Read-only stars, filled to the exact average (e.g. 3.6 of 5)
export const Stars = ({ value = 0, size = "sm" }) => {
  const percent = Math.max(0, Math.min(5, value)) * 20;
  return (
    <span
      className={`stars stars--${size}`}
      role="img"
      aria-label={value ? `Rated ${value.toFixed(1)} out of 5` : "No ratings yet"}
    >
      <span className="stars__base">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} />
        ))}
      </span>
      <span className="stars__fill" style={{ width: `${percent}%` }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} />
        ))}
      </span>
    </span>
  );
};

const WORDS = ["", "Didn't like it", "It was okay", "Liked it", "Really liked it", "Loved it"];

// Clickable 1–5 picker for writing a review
export const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="star-picker">
      <div
        className="star-picker__stars"
        role="radiogroup"
        aria-label="Your rating"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className={n <= shown ? "is-on" : ""}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
          >
            <Star />
          </button>
        ))}
      </div>
      <span className="star-picker__word">{WORDS[shown] || "Pick a rating"}</span>
    </div>
  );
};
