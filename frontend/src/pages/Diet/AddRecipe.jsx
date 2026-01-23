import { useState } from "react";
import api from "../../api/axios";
import { useNotification } from "../../components/NotificationContext";

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
  const { showNotification } = useNotification();

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

      showNotification("Recipe added");
      window.location.href = "/diet";
    } catch (err) {
      console.error(err);
      showNotification("Failed to add recipe", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-2xl space-y-6
          rounded-xl border border-slate-700 bg-slate-800
          p-8
        "
      >
        <h1 className="text-2xl font-semibold text-slate-100">
          Add New Recipe
        </h1>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-400">
            Recipe Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Chicken Rice Bowl"
            className="
              w-full rounded-lg border border-slate-600
              bg-slate-900 px-3 py-2 text-slate-100
              focus:outline-none focus:border-slate-400
            "
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-400">
            Ingredients (one per line)
          </label>
          <textarea
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            rows={4}
            required
            className="
              w-full rounded-lg border border-slate-600
              bg-slate-900 px-3 py-2 text-slate-100
            "
            placeholder={`Chicken breast\nRice\nSalt`}
          />
        </div>

        {/* Steps */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-400">
            Steps (one per line)
          </label>
          <textarea
            name="steps"
            value={form.steps}
            onChange={handleChange}
            rows={4}
            required
            className="
              w-full rounded-lg border border-slate-600
              bg-slate-900 px-3 py-2 text-slate-100
            "
            placeholder={`Boil rice\nCook chicken\nMix together`}
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
            className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
          />
          <input
            name="protein"
            value={form.protein}
            onChange={handleChange}
            type="number"
            placeholder="Protein (g)"
            className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
          />
          <input
            name="carbs"
            value={form.carbs}
            onChange={handleChange}
            type="number"
            placeholder="Carbs (g)"
            className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
          />
          <input
            name="fat"
            value={form.fat}
            onChange={handleChange}
            type="number"
            placeholder="Fat (g)"
            className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="
              px-4 py-2 rounded-lg
              border border-slate-600
              text-slate-300 hover:bg-slate-700
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="
              px-6 py-2 rounded-lg
              bg-emerald-500 text-black font-semibold
              hover:bg-emerald-400
              transition active:scale-95
              disabled:opacity-50
            "
          >
            {loading ? "Saving..." : "Add Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}
