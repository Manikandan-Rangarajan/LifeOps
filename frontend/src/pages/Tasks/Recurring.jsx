import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../components/NotificationContext";

export default function Recurring() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const fetchRecurring = async () => {
    try {
      const res = await api.get("/recurring");
      setEvents(res.data.events || []);
    } catch (err) {
      console.error(err);
      showNotification("Failed to load recurring tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, []);

  const pauseRecurring = async (id) => {
    try {
      await api.patch(`/recurring/${id}/pause`);
      showNotification("Recurring task paused", "success");
      fetchRecurring();
    } catch {
      showNotification("Failed to pause task", "error");
    }
  };

  const resumeRecurring = async (id) => {
    try {
      await api.patch(`/recurring/${id}/resume`);
      showNotification("Recurring task resumed", "success");
      fetchRecurring();
    } catch {
      showNotification("Failed to resume task", "error");
    }
  };

  const deleteRecurring = async (id) => {
    const ok = window.confirm("Delete this recurring task permanently machi?");
    if (!ok) return;

    try {
      await api.delete(`/recurring/${id}`);
      showNotification("Recurring task deleted", "success");
      fetchRecurring();
    } catch {
      showNotification("Failed to delete task", "error");
    }
  };

  if (loading) {
    return <p className="p-6 text-slate-400">Loading recurring tasks...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-300">
          Recurring Tasks
        </h1>
        <button
          onClick={() => navigate("/tasks/recurring/new")}
          className="px-4 py-2 bg-emerald-500 text-black rounded-lg font-semibold"
        >
          + New Recurring
        </button>
      </div>

      {events.length === 0 && (
        <p className="text-slate-500">
          No recurring tasks yet machi. Discipline starts here.
        </p>
      )}

      {events.map((e) => (
        <div
          key={e._id}
          className={`rounded-xl border border-slate-700 bg-slate-800
          p-4 flex justify-between items-center
          ${!e.active ? "opacity-60" : ""}`}
        >
          {/* Left */}
          <div>
            <p className="font-semibold text-white">{e.title}</p>

            <p className="text-sm text-slate-400">
              {e.rule?.frequency || "UNKNOWN"} • starts{" "}
              {e.startAt
                ? new Date(e.startAt).toLocaleString()
                : "Not scheduled"}
            </p>

            {!e.active && (
              <p className="text-xs text-red-500 mt-1">Paused</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {e.active ? (
              <button
                onClick={() => pauseRecurring(e._id)}
                className="px-3 py-1 border rounded text-slate-300 hover:bg-slate-700"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={() => resumeRecurring(e._id)}
                className="px-3 py-1 bg-emerald-500 text-black rounded"
              >
                Resume
              </button>
            )}

            <button
              onClick={() => deleteRecurring(e._id)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
