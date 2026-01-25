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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      mealType: form.mealType,
      calories: parseInt(form.calories, 10), // integer only
      date: form.date || new Date().toISOString().split("T")[0],
    };

    if (form.protein !== "") payload.protein = Number(form.protein);
    if (form.carbs !== "") payload.carbs = Number(form.carbs);
    if (form.fats !== "") payload.fats = Number(form.fats);
    if (form.fiber !== "") payload.fiber = Number(form.fiber);

    await api.post("/diet/log", payload);
    navigate("/diet");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-6"
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
          className="w-full rounded border border-slate-600 bg-slate-900 p-2 text-slate-100"
        >
          <option value="">Select Meal</option>
          <option value="BREAKFAST">BREAKFAST</option>
          <option value="LUNCH">LUNCH</option>
          <option value="SNACK">SNACK</option>
          <option value="DINNER">DINNER</option>
        </select>

        {/* Calories (INTEGER) */}
        <input
          name="calories"
          type="number"
          step="1"
          min="0"
          placeholder="Calories"
          required
          value={form.calories}
          onChange={handleChange}
          className="w-full rounded border border-slate-600 bg-slate-900 p-2 text-slate-100"
        />

        {/* Macros (DECIMALS) */}
        <input
          name="protein"
          type="number"
          step="0.1"
          min="0"
          placeholder="Protein (g)"
          value={form.protein}
          onChange={handleChange}
          className="w-full rounded border border-slate-600 bg-slate-900 p-2 text-slate-100"
        />

        <input
          name="carbs"
          type="number"
          step="0.1"
          min="0"
          placeholder="Carbs (g)"
          value={form.carbs}
          onChange={handleChange}
          className="w-full rounded border border-slate-600 bg-slate-900 p-2 text-slate-100"
        />

        <input
          name="fats"
          type="number"
          step="0.1"
          min="0"
          placeholder="Fats (g)"
          value={form.fats}
          onChange={handleChange}
          className="w-full rounded border border-slate-600 bg-slate-900 p-2 text-slate-100"
        />

        <input
          name="fiber"
          type="number"
          step="0.1"
          min="0"
          placeholder="Fiber (g)"
          value={form.fiber}
          onChange={handleChange}
          className="w-full rounded border border-slate-600 bg-slate-900 p-2 text-slate-100"
        />

        {/* Date */}
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full rounded border border-slate-600 bg-slate-900 p-2 text-slate-100"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-500 py-2 font-semibold text-black hover:bg-emerald-400 transition"
        >
          Add Log
        </button>
      </form>
    </div>
  );
}
