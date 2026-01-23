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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-3"
      >
        <h1 className="text-xl font-semibold">Log Food</h1>

        <input
          name="mealType"
          placeholder="Meal (Breakfast / Lunch)"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="calories"
          type="number"
          placeholder="Calories"
          required
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input name="protein" type="number" placeholder="Protein (g)" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="carbs" type="number" placeholder="Carbs (g)" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="fats" type="number" placeholder="Fats (g)" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="fiber" type="number" placeholder="Fiber (g)" onChange={handleChange} className="w-full border p-2 rounded" />

        <input
          name="date"
          type="date"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Add Log
        </button>
      </form>
    </div>
  );
}
