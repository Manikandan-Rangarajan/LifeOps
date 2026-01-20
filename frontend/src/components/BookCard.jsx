// button redirects to login for no reason --> pls fix

import { useNavigate } from "react-router-dom";
import { startReading } from "../api/books.api";
import Badge from "./Badge";

export default function BookCard({ book, state, onStateChange }) {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!state || state.status === "NOT_STARTED") {
      // 🔥 START READING
      try {
        const res = await startReading(book._id);
        onStateChange(book._id, res.data.state);
        navigate(`/books/${book._id}`);
      } catch (err) {
        console.error("Failed to start reading", err);
      }
      return;
    }

    // READING or FINISHED → go to details
    navigate(`/books/${book._id}`);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {book.title}
          </h3>
          <p className="text-sm text-gray-500">{book.author}</p>
        </div>

        <Badge status={state?.status || "NOT_STARTED"} />
      </div>

      <p className="mt-3 text-sm text-gray-600">
        Total pages: {book.totalPages}
      </p>

      {state?.status === "READING" && (
        <p className="mt-1 text-xs text-gray-500">
          Current page: {state.currentPage}
        </p>
      )}

      <button
        onClick={handleClick}
        className="mt-4 w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
      >
        {state?.status === "READING"
          ? "Continue reading"
          : state?.status === "FINISHED"
          ? "View details"
          : "Start reading"}
      </button>
    </div>
  );
}
