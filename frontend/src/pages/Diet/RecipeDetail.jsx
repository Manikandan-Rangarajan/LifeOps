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
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading recipe...
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Recipe not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-orange-600 font-semibold hover:underline"
      >
        ← Back
      </button>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          {recipe.title}
        </h1>

        {/* Macros */}
        {recipe.macros && (
          <div className="flex gap-6 mb-8 text-sm text-gray-700">
            {recipe.macros.calories && <span>🔥 {recipe.macros.calories} kcal</span>}
            {recipe.macros.protein && <span>💪 {recipe.macros.protein}g protein</span>}
            {recipe.macros.carbs && <span>🍞 {recipe.macros.carbs}g carbs</span>}
            {recipe.macros.fats && <span>🥑 {recipe.macros.fats}g fats</span>}
          </div>
        )}

        {/* Ingredients */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Steps */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Steps</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            {recipe.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
