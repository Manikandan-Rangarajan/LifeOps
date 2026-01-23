import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AddHabit() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
  });
  const navigate = useNavigate();

  const submit = async (e) => {
  e.preventDefault();
  try {
    await api.post("/habit", form);
    showNotification("Habit created");
    navigate("/tasks/habits");
  } catch {
    showNotification("Failed to create habit", "error");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-3"
      >
        <h1 className="text-xl font-semibold">Create Habit</h1>

        <input
          placeholder="Title"
          required
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          required
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-emerald-500 text-white py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
