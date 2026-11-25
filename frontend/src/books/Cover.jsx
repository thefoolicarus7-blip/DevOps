import { coverColor } from "./bookUtils";

// A cloth-bound cover typeset from the book's own title and author
const Cover = ({ title, author, size = "md" }) => {
  return (
    <div
      className={`cover cover--${size}`}
      style={{ "--cloth": coverColor(title) }}
      aria-hidden="true"
    >
      <div className="cover__band" />
      <p className="cover__title">{title}</p>
      {author && <p className="cover__author">{author}</p>}
    </div>
  );
};

export default Cover;
