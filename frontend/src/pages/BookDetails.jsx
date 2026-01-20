import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
        setSessions([]); // no sessions yet is NORMAL
      }
    }
  };

  load();
}, [id]);


  if (!book) return <div className="p-6">Loading...</div>;

  const handleStart = async () => {
    const res = await startReading(id);
    setState(res.data.state);
    console.log(res.data.state);
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
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <button
  onClick={() => navigate("/books")}
  className="mb-4 flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
>
  ← Back to Books
</button>

        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold">{book.title}</h1>
          <p className="text-gray-600">{book.author}</p>

          {state ? (
            <>
              <p className="mt-4 text-sm">
                Progress: {state.currentPage} / {book.totalPages}
              </p>

              {state.status === "READING" && (
                <div className="mt-4 space-y-2">
                  <input
                    type="number"
                    placeholder="End page"
                    value={endPage}
                    onChange={(e) => setEndPage(e.target.value)}
                    className="w-full rounded border px-3 py-2 text-sm"
                  />
                  <textarea
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded border px-3 py-2 text-sm"
                  />
                  <button
                    onClick={handleLog}
                    className="rounded bg-indigo-600 px-4 py-2 text-sm text-white"
                  >
                    Log session
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={handleStart}
              className="mt-4 rounded bg-indigo-600 px-4 py-2 text-sm text-white"
            >
              Start Reading
            </button>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-3 text-lg font-semibold">Reading Sessions</h2>
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-600">No sessions yet</p>
          ) : (
            <ul className="space-y-2 text-sm">
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
