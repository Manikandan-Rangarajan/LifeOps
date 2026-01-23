import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function DietHome() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await api.get("/diet/recipe");
        setRecipes(res.data.recipes || res.data);
      } catch (err) {
        console.error("Failed to fetch recipes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading recipes…
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-200">
          Recipes
        </h1>

        <button
          onClick={() => navigate("/diet/new")}
          className="
            px-5 py-2.5 rounded-xl
            bg-emerald-500 text-black font-semibold
            hover:bg-emerald-400
            transition active:scale-95
          "
        >
          + Add Recipe
        </button>
      </div>

      {/* Content */}
      {recipes.length === 0 ? (
        <p className="text-slate-400">
          No recipes yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              onClick={() => navigate(`/diet/recipe/${recipe._id}`)}
              className="
                cursor-pointer rounded-xl
                border border-slate-700 bg-slate-800
                p-5 transition
                hover:translate-y-[-2px] hover:border-slate-600
                active:scale-95
              "
            >
              <h2 className="text-lg font-semibold text-slate-100 mb-2">
                {recipe.title}
              </h2>

              <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                {recipe.ingredients?.join(", ")}
              </p>

              {recipe.macros?.calories && (
                <div className="text-sm text-slate-400">
                  🔥 {recipe.macros.calories} kcal
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
