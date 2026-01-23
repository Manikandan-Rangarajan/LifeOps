import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useNotification } from "../../components/NotificationContext";

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const fetchHabits = async () => {
    try {
      const res = await api.get("/habit");
      setHabits(res.data.habits || res.data.result);
    } catch (err) {
      showNotification("Failed to load habits", "error");
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const completeHabit = async (id) => {
    try {
      const res = await api.patch(`/habit/${id}/complete`);
      showNotification(res.data.message || "Habit completed");
      fetchHabits();
    } catch (err) {
      showNotification("Failed to complete habit", "error");
    }
  };

  const pauseHabit = async (id) => {
    try {
      await api.patch(`/habit/${id}/pause`);
      showNotification("Habit paused");
      fetchHabits();
    } catch (err) {
      showNotification("Failed to pause habit", "error");
    }
  };

  const resumeHabit = async (id) => {
    try {
      await api.patch(`/habit/${id}/resume`);
      showNotification("Habit resumed");
      fetchHabits();
    } catch (err) {
      showNotification("Failed to resume habit", "error");
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-slate-400 font-bold">Habits</h1>
        <button
          onClick={() => navigate("/tasks/habits/new")}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
        >
          + New Habit
        </button>
      </div>

      {habits.length === 0 && (
        <p className="text-slate-500">No habits yet.</p>
      )}

      {/* Habit List */}
      {habits.map((h) => (
        <div
          key={h._id}
          className={`rounded-xl border border-slate-700 bg-slate-800
  p-4 flex justify-between items-center
            ${!h.active ? "opacity-60" : ""}`}
        >
          {/* Left info */}
          <div>
            <p className="font-semibold">{h.title}</p>
            <p className="text-sm text-slate-500">
              🔥 {h.currentStreak} | 🏆 {h.longestStreak}
            </p>
            {!h.active && (
              <p className="text-xs text-red-500 mt-1">
                Paused
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {h.active ? (
              <>
                <button
                  onClick={() => completeHabit(h._id)}
                  className="px-3 py-1 bg-black text-white rounded"
                >
                  Done
                </button>

                <button
                  onClick={() => pauseHabit(h._id)}
                  className="px-3 py-1 border rounded text-slate-600"
                >
                  Pause
                </button>
              </>
            ) : (
              <button
                onClick={() => resumeHabit(h._id)}
                className="px-3 py-1 bg-emerald-500 text-white rounded"
              >
                Resume
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
