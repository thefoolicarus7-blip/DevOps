import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { errorMessage } from "../api";
import Cover from "./Cover";

const blank = {
  title: "",
  author: "",
  genre: "",
  publication: "",
  price: "",
  stock: "",
  description: "",
};

// Used for both "Add a book" and "Edit details"
const BookForm = () => {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(editing);

  useEffect(() => {
    if (!editing) return;
    const load = async () => {
      try {
        const { data } = await api.get(`/book/${id}`);
        const b = data.result;
        setForm({
          title: b.title ?? "",
          author: b.author ?? "",
          genre: b.genre ?? "",
          publication: b.publication ?? "",
          price: b.price ?? "",
          stock: b.stock ?? "",
          description: b.description ?? "",
        });
      } catch (err) {
        setServerError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [editing, id]);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Enter the book's title.";
    if (form.price === "" || Number(form.price) < 0) next.price = "Enter a price of 0 or more.";
    if (form.stock === "" || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)
      next.stock = "Enter a whole number of copies, 0 or more.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setServerError("");
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      const { data } = editing
        ? await api.patch(`/book/${id}`, payload)
        : await api.post("/book", payload);
      navigate(`/books/${data.result._id}`);
    } catch (err) {
      setServerError(errorMessage(err));
      setSaving(false);
    }
  };

  if (loading) return <main className="page"><p className="notice">Loading…</p></main>;

  const field = (key, label, props = {}) => (
    <label className={`field ${errors[key] ? "has-error" : ""}`}>
      <span>{label}</span>
      <input
        value={form[key]}
        onChange={set(key)}
        aria-invalid={Boolean(errors[key])}
        {...props}
      />
      {errors[key] && <small className="field__error">{errors[key]}</small>}
    </label>
  );

  return (
    <main className="page page--narrow">
      <Link to={editing ? `/books/${id}` : "/"} className="back-link">
        {editing ? "Back to the book" : "Back to the shelf"}
      </Link>
      <h1 className="display display--sm">{editing ? "Edit book details" : "Add a book to the shelf"}</h1>

      <div className="form-layout">
        <form className="book-form" onSubmit={save} noValidate>
          {field("title", "Title")}
          <div className="field-row">
            {field("author", <>Author <em>Optional</em></>)}
            {field("genre", <>Genre <em>Optional</em></>, { placeholder: "e.g. Fiction, History" })}
          </div>
          {field("publication", <>Publisher <em>Optional</em></>)}
          <div className="field-row">
            {field("price", "Price (Rs.)", { type: "number", min: 0, inputMode: "decimal" })}
            {field("stock", "Copies in stock", { type: "number", min: 0, step: 1, inputMode: "numeric" })}
          </div>
          <label className="field">
            <span>Short description <em>Optional</em></span>
            <textarea rows="5" value={form.description} onChange={set("description")} />
          </label>

          {serverError && <p className="form-error" role="alert">{serverError}</p>}

          <div className="form-actions">
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving…" : editing ? "Save changes" : "Add book"}
            </button>
            <Link to={editing ? `/books/${id}` : "/"} className="btn btn--text">Cancel</Link>
          </div>
        </form>

        <aside className="form-preview" aria-label="Cover preview">
          <Cover title={form.title || "Untitled"} author={form.author} size="lg" />
          <p>The cover is made from the title and author.</p>
        </aside>
      </div>
    </main>
  );
};

export default BookForm;
