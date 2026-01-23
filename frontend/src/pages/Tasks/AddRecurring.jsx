import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AddRecurring() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    frequency: "DAILY",
    startAt: "",
  });

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/recurring", {
      title: form.title,
      description: form.description,
      rule: { frequency: form.frequency },
      startAt: form.startAt,
    });
    navigate("/tasks");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-3"
      >
        <h1 className="text-xl font-semibold">Recurring Task</h1>

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

        <select
          onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
        </select>

        <input
          type="datetime-local"
          required
          onChange={(e) => setForm({ ...form, startAt: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-emerald-500 text-white py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
