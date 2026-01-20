import { useState } from "react";
import { createBook } from "../api/books.api";

export default function AddBookModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    totalPages: "",
    tags: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createBook({
        title: form.title,
        author: form.author,
        totalPages: Number(form.totalPages),
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim())
          : [],
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Add Book</h2>

        {error && (
          <div className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <input
            name="author"
            placeholder="Author"
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <input
            name="totalPages"
            type="number"
            placeholder="Total pages"
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <input
            name="tags"
            placeholder="Tags (comma separated)"
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded border py-2 text-sm"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="flex-1 rounded bg-indigo-600 py-2 text-sm text-white"
            >
              {loading ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
