import { useEffect, useState } from "react";
import {
  getAllBooks,
  getReadingState,
} from "../api/books.api";
import BookCard from "../components/BookCard";
import AddBookModal from "../components/AddBookModal";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [states, setStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await getAllBooks();
        const list = res.data.books || res.data;
        setBooks(list);

        // fetch reading states per book
        const stateResults = await Promise.all(
          list.map(async (book) => {
            try {
              const r = await getReadingState(book._id);
              return { bookId: book._id, state: r.data.state };
            } catch (err) {
              if (err.response?.status === 404) {
                return {
                  bookId: book._id,
                  state: { status: "NOT_STARTED", currentPage: 0 },
                };
              }
              throw err;
            }
          })
        );

        const map = {};
        stateResults.forEach(({ bookId, state }) => {
          map[bookId] = state;
        });
        setStates(map);
      } catch (err) {
        console.error("Failed to load books", err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const handleStateChange = (bookId, newState) => {
    setStates((prev) => ({
      ...prev,
      [bookId]: newState,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Loading books…
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-100">
            Books
          </h1>

          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            + Add Book
          </button>
        </div>

        {/* Content */}
        {books.length === 0 ? (
          <p className="text-slate-400">
            No books added yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                state={states[book._id]}
                onStateChange={handleStateChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showAddModal && (
        <AddBookModal
          onClose={() => setShowAddModal(false)}
          onCreated={async () => {
            const res = await getAllBooks();
            setBooks(res.data.books || res.data);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
