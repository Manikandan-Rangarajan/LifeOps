import { useNavigate } from "react-router-dom";
import { startReading } from "../api/books.api";
import Badge from "./Badge";

export default function BookCard({ book, state, onStateChange }) {
  const navigate = useNavigate();

  const handleAction = async () => {
    try {
      // If not started, start reading first
      if (!state || state.status === "NOT_STARTED") {
        const res = await startReading(book._id);
        onStateChange(book._id, res.data.state);
      }

      // ALWAYS go to details page
      navigate(`/books/${book._id}`);
    } catch (err) {
      console.error("Book action failed", err);
    }
  };

  return (
    <div
      className="
        rounded-xl
        border border-slate-700
        bg-slate-800
        p-4
        shadow-sm
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-100">
            {book.title}
          </h3>
          <p className="text-sm text-slate-400">
            {book.author}
          </p>
        </div>

        <Badge status={state?.status || "NOT_STARTED"} />
      </div>

      <p className="mt-3 text-sm text-slate-400">
        Total pages: {book.totalPages}
      </p>

      {state?.status === "READING" && (
        <p className="mt-1 text-xs text-slate-500">
          Current page: {state.currentPage}
        </p>
      )}

      {/* ACTION BUTTON — ALWAYS PRESENT */}
      <button
        onClick={handleAction}
        className="
          mt-4 w-full rounded-md
          bg-green-400 text-black
          py-2 text-sm font-semibold
          hover:bg-green-800
          transition
        "
      >
        {state?.status === "READING"
          ? "Continue Reading"
          : state?.status === "FINISHED"
          ? "View Details"
          : "Start Reading"}
      </button>
    </div>
  );
}
