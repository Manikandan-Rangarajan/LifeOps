import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
// import Navbar from "../../components/Navbar";

export default function AddDietLog() {
  const [recipes, setRecipes] = useState([]);
  const [recipeId, setRecipeId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/diet/recipes").then((res) => {
      setRecipes(res.data.recipes || res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/diet/logs", {
      recipeId,
      quantity,
      date: date || new Date(),
    });

    navigate("/diet/logs");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
        {/* <Navbar/> */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-semibold">Log Food</h1>

        <select
          value={recipeId}
          onChange={(e) => setRecipeId(e.target.value)}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select Recipe</option>
          {recipes.map((r) => (
            <option key={r._id} value={r._id}>
              {r.title}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Servings"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:opacity-90"
        >
          Add Log
        </button>
      </form>
    </div>
  );
}
