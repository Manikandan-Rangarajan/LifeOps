import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBookById,
  getReadingState,
  startReading,
  logSession,
  getMySessions,
} from "../api/books.api";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [state, setState] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [endPage, setEndPage] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const load = async () => {
      const b = await getBookById(id);
      setBook(b.data.book);

      try {
        const s = await getReadingState(id);
        setState(s.data.state);
      } catch (err) {
        if (err.response?.status === 404) {
          setState({ status: "NOT_STARTED", currentPage: 0 });
        }
      }

      try {
        const sess = await getMySessions(id);
        setSessions(sess.data.sessions);
      } catch (err) {
        if (err.response?.status === 404) {
          setSessions([]);
        }
      }
    };

    load();
  }, [id]);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Loading...
      </div>
    );
  }

  const handleStart = async () => {
    const res = await startReading(id);
    setState(res.data.state);
  };

  const handleLog = async () => {
    const res = await logSession(id, {
      startPage: state.currentPage,
      endPage: Number(endPage),
      notes,
    });

    setState(res.data.state);
    setSessions((prev) => [...prev, res.data.session]);
    setEndPage("");
    setNotes("");
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate("/books")}
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          ← Back to Books
        </button>

        {/* Book Info */}
        <div className="rounded-xl bg-slate-800 border border-slate-700 p-6">
          <h1 className="text-2xl font-semibold text-slate-100">
            {book.title}
          </h1>
          <p className="text-slate-400">{book.author}</p>

          {state && (
            <p className="mt-4 text-sm text-slate-400">
              Progress: {state.currentPage} / {book.totalPages}
            </p>
          )}

          {state?.status === "READING" && (
            <div className="mt-4 space-y-2">
              <input
                type="number"
                placeholder="End page"
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
                className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              />
              <textarea
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              />
              <button
                onClick={handleLog}
                className="rounded bg-lime-500 px-4 py-2 text-sm font-semibold text-black hover:bg-lime-400 transition"
              >
                Log session
              </button>
            </div>
          )}

          {state?.status === "NOT_STARTED" && (
            <button
              onClick={handleStart}
              className="mt-4 rounded bg-green-400 px-4 py-2 text-sm font-semibold text-black hover:bg-green-800 transition"
            >
              Start Reading
            </button>
          )}
        </div>

        {/* Sessions */}
        <div className="rounded-xl bg-slate-800 border border-slate-700 p-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-100">
            Reading Sessions
          </h2>

          {sessions.length === 0 ? (
            <p className="text-sm text-slate-400">
              No sessions yet
            </p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-300">
              {sessions.map((s) => (
                <li key={s._id}>
                  {s.date}: {s.startPage} → {s.endPage}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
