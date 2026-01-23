import { useState } from "react";
import api from "../../api/axios";

export default function AddRecipe() {
  const [form, setForm] = useState({
    title: "",
    ingredients: "",
    steps: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/diet/recipe", {
        title: form.title,
        ingredients: form.ingredients.split("\n"),
        steps: form.steps.split("\n"),
        macros: {
          calories: Number(form.calories),
          protein: Number(form.protein),
          carbs: Number(form.carbs),
          fat: Number(form.fat),
        },
      });

      window.location.href = "/diet";
    } catch (err) {
      console.error(err);
      alert("Something broke. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-xl shadow-sm border p-8 space-y-6"
      >
        <h1 className="text-2xl font-semibold text-gray-800">
          Add New Recipe
        </h1>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Recipe Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Chicken Rice Bowl"
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Ingredients (one per line)
          </label>
          <textarea
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Chicken breast&#10;Rice&#10;Salt"
          />
        </div>

        {/* Steps */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Steps (one per line)
          </label>
          <textarea
            name="steps"
            value={form.steps}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Boil rice&#10;Cook chicken&#10;Mix together"
          />
        </div>

        {/* Macros */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="calories"
            value={form.calories}
            onChange={handleChange}
            type="number"
            placeholder="Calories"
            className="border rounded-lg px-3 py-2"
          />
          <input
            name="protein"
            value={form.protein}
            onChange={handleChange}
            type="number"
            placeholder="Protein (g)"
            className="border rounded-lg px-3 py-2"
          />
          <input
            name="carbs"
            value={form.carbs}
            onChange={handleChange}
            type="number"
            placeholder="Carbs (g)"
            className="border rounded-lg px-3 py-2"
          />
          <input
            name="fat"
            value={form.fat}
            onChange={handleChange}
            type="number"
            placeholder="Fat (g)"
            className="border rounded-lg px-3 py-2"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-black text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}
