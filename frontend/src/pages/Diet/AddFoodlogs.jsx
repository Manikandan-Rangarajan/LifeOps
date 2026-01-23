import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AddFoodLog() {
  const [form, setForm] = useState({
    mealType: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    fiber: "",
    date: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/diet/log", {
      ...form,
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fats: Number(form.fats),
      fiber: Number(form.fiber),
      date: form.date || new Date(),
    });

    navigate("/diet");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md space-y-4
          rounded-xl border border-slate-700 bg-slate-800
          p-6 transition
        "
      >
        <h1 className="text-xl font-semibold text-slate-100">
          Log Food
        </h1>

        {/* Meal Type */}
        <select
          name="mealType"
          value={form.mealType}
          onChange={handleChange}
          required
          className="
            w-full rounded border border-slate-600
            bg-slate-900 p-2 text-slate-100
          "
        >
          <option value="">Select Meal</option>
          <option value="BREAKFAST">BREAKFAST</option>
          <option value="LUNCH">LUNCH</option>
          <option value="SNACK">SNACK</option>
          <option value="DINNER">DINNER</option>
        </select>

        {/* Calories */}
        <input
          name="calories"
          type="number"
          placeholder="Calories"
          required
          onChange={handleChange}
          className="
            w-full rounded border border-slate-600
            bg-slate-900 p-2 text-slate-100
          "
        />

        {/* Macros */}
        <input
          name="protein"
          type="number"
          placeholder="Protein (g)"
          onChange={handleChange}
          className="w-full rounded border border-slate-600 bg-slate-900 p-2 text-slate-100"
        />
        <input
          name="carbs"
          type="number"
          placeholder="Carbs (g)"
          onChange={handleChange}
          className="w-full rounded border border-slate-600 bg-slate-900 p-2 text-slate-100"
        />
        <input
          name="fats"
          type="number"
          placeholder="Fats (g)"
          onChange={handleChange}
          className="w-full rounded border border-slate-600 bg-slate-900 p-2 text-slate-100"
        />
        <input
          name="fiber"
          type="number"
          placeholder="Fiber (g)"
          onChange={handleChange}
          className="w-full rounded border border-slate-600 bg-slate-900 p-2 text-slate-100"
        />

        {/* Date */}
        <input
          name="date"
          type="date"
          onChange={handleChange}
          className="
            w-full rounded border border-slate-600
            bg-slate-900 p-2 text-slate-100
          "
        />

        {/* Action */}
        <button
          className="
            w-full rounded-lg
            bg-emerald-500 py-2 font-semibold text-black
            hover:bg-emerald-400
            transition active:scale-95
          "
        >
          Add Log
        </button>
      </form>
    </div>
  );
}
