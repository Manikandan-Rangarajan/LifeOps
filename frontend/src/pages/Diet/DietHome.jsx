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
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading recipes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Recipes
        </h1>

        <button
          onClick={() => navigate("/diet/new")}
          className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold
                     hover:bg-orange-600 transition"
        >
          + Add Recipe
        </button>
      </div>

      {/* Content */}
      {recipes.length === 0 ? (
        <div className="text-gray-600">
          No recipes yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              onClick={() => navigate(`/diet/recipe/${recipe._id}`)}
              className="bg-white rounded-2xl p-5 shadow 
                         hover:shadow-lg transition cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {recipe.title}
              </h2>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {recipe.ingredients?.join(", ")}
              </p>

              {recipe.macros?.calories && (
                <div className="text-sm text-gray-500">
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
