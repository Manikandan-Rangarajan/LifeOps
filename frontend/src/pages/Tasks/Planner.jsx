import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Planner() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await api.get("/planner");
      setEvents(res.data.events);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const completeEvent = async (id) => {
    await api.patch(`/planner/${id}/complete`);
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    const confirm = window.confirm("Delete this event machi?");
    if (!confirm) return;

    await api.delete(`/planner/${id}`);
    fetchEvents();
  };

  if (loading) {
    return <p className="p-6 text-slate-400">Loading da machi...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-300">Planner</h1>
        <button
          onClick={() => navigate("/tasks/planner/new")}
          className="px-4 py-2 bg-emerald-500 text-black rounded-lg font-semibold"
        >
          + New Event
        </button>
      </div>

      {events.length === 0 && (
        <p className="text-slate-500 text-sm">
          No events yet machi. Plan pannala na life random ah pogum 😤
        </p>
      )}

      {events.map((e) => (
        <div
          key={e._id}
          className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold text-white">{e.title}</p>
            <p className="text-sm text-slate-400">
              {new Date(e.eventTime).toLocaleString()}
            </p>
            {e.completed && (
              <p className="text-xs text-emerald-400 mt-1">Completed ✔</p>
            )}
          </div>

          <div className="flex gap-2">
            {!e.completed && (
              <button
                onClick={() => completeEvent(e._id)}
                className="px-3 py-1 bg-emerald-600 text-black rounded"
              >
                Done
              </button>
            )}
            <button
              onClick={() => deleteEvent(e._id)}
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
