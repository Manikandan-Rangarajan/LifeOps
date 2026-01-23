import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/diet/recipe/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error("Failed to fetch recipe", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading recipe…
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Recipe not found
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-slate-400 hover:text-slate-200"
      >
        ← Back
      </button>

      <div
        className="
          max-w-3xl mx-auto
          rounded-2xl border border-slate-700 bg-slate-800
          p-8 space-y-8
        "
      >
        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-100">
          {recipe.title}
        </h1>

        {/* Macros */}
        {recipe.macros && (
          <div className="flex flex-wrap gap-6 text-sm text-slate-300">
            {recipe.macros.calories && (
              <span>🔥 {recipe.macros.calories} kcal</span>
            )}
            {recipe.macros.protein && (
              <span>💪 {recipe.macros.protein} g protein</span>
            )}
            {recipe.macros.carbs && (
              <span>🍞 {recipe.macros.carbs} g carbs</span>
            )}
            {recipe.macros.fats && (
              <span>🥑 {recipe.macros.fats} g fats</span>
            )}
          </div>
        )}

        {/* Ingredients */}
        <section>
          <h2 className="text-xl font-semibold text-slate-100 mb-3">
            Ingredients
          </h2>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Steps */}
        <section>
          <h2 className="text-xl font-semibold text-slate-100 mb-3">
            Steps
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-slate-300">
            {recipe.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
