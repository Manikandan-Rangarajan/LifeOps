import { useEffect, useState } from "react";
import { getAllBooks, getReadingState } from "../api/books.api";
import BookCard from "../components/BookCard";
import AddBookModal from "../components/AddBookModal";


export default function Books() {
  const [books, setBooks] = useState([]);
  const [states, setStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const updateState = (bookId, newState) => {
  setStates((prev) => ({
    ...prev,
    [bookId]: newState,
  }));
};




  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await getAllBooks();
        setBooks(res.data.books);

        // fetch reading states
        const statePromises = res.data.books.map((book) =>
          getReadingState(book._id)
            .then((r) => ({ bookId: book._id, state: r.data.state }))
            .catch((err) => {
  if (err.response?.status === 404) {
    return {
      bookId: book._id,
      state: { status: "NOT_STARTED", currentPage: 0 },
    };
  }
  console.error("Unexpected error fetching state", err);
  throw err;
})

        );

        const results = await Promise.all(statePromises);
        const map = {};
        results.forEach(({ bookId, state }) => {
          map[bookId] = state;
        });

        setStates(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading books...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-100 px-6 py-8">
    <div className="mx-auto max-w-6xl">

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Books
        </h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
        >
          + Add Book
        </button>
      </div>

      {books.length === 0 ? (
        <p className="text-gray-600">No books available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard
  key={book._id}
  book={book}
  state={states[book._id]}
  onStateChange={updateState}
/>

          ))}
        </div>
      )}
    </div>

    {showAddModal && (
      <AddBookModal
        onClose={() => setShowAddModal(false)}
        onCreated={async () => {
  const res = await getAllBooks();
  setBooks(res.data.books);
  setShowAddModal(false);
}}

      />
    )}
  </div>
);
}
