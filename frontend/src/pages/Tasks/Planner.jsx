import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Planner() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    const res = await api.get("/planner");
    setEvents(res.data.events);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const complete = async (id) => {
    await api.patch(`/planner/${id}/complete`);
    fetchEvents();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-slate-400 font-bold">Planner</h1>
        <button
          onClick={() => navigate("/tasks/planner/new")}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
        >
          + New Event
        </button>
      </div>

      {events.map((e) => (
        <div
          key={e._id}
          className="bg-white rounded-xl shadow p-4 flex justify-between"
        >
          <div>
            <p className="font-semibold">{e.title}</p>
            <p className="text-sm text-slate-500">
              {new Date(e.eventTime).toLocaleString()}
            </p>
          </div>

          {!e.completed && (
            <button
              onClick={() => complete(e._id)}
              className="px-3 py-1 bg-black text-white rounded"
            >
              Done
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
