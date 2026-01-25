import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../components/NotificationContext";

export default function AddHabit() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
  });

  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/habit", form);

      showNotification("Habit created successfully", "success");

      // slight delay = better UX, optional but nice
      setTimeout(() => {
        navigate("/tasks/habits");
      }, 300);
    } catch (err) {
      console.error(err);
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
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          required
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-emerald-500 text-white py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
