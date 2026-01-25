import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AddNewPlanner() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [remindBefore, setRemindBefore] = useState(30);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!title || !eventTime) {
      alert("Title and time mandatory machi");
      return;
    }

    try {
      await api.post("/planner", {
        title,
        description,
        eventTime,
        remindBefore,
      });

      navigate("/tasks/planner");
    } catch (err) {
      console.error(err);
      alert("Event create panna mudiyala da 😤");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-300 mb-6">
        Add New Event
      </h1>

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="text-sm text-slate-400">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400">Event Time *</label>
          <input
            type="datetime-local"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400">
            Remind Before (minutes)
          </label>
          <input
            type="number"
            value={remindBefore}
            onChange={(e) => setRemindBefore(e.target.value)}
            className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-black rounded font-semibold"
          >
            Create Event
          </button>
          <button
            type="button"
            onClick={() => navigate("/tasks/planner")}
            className="px-4 py-2 bg-slate-700 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
