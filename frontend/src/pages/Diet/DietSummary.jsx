import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function DietSummary() {
  const [logs, setLogs] = useState([]);
  const [monthly, setMonthly] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    const fetchData = async () => {
      try {
        const [logRes, monthlyRes] = await Promise.all([
          api.get(`/diet/log?date=${today}`),
          api.get(
            `/diet/log/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
          ),
        ]);

        setLogs(logRes.data.log);
        setMonthly(monthlyRes.data);
      } catch (err) {
        console.error("Failed to load diet summary", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading diet summary...
      </div>
    );
  }

  const totals = logs.reduce(
    (acc, l) => {
      acc.calories += l.calories || 0;
      acc.protein += l.protein || 0;
      acc.carbs += l.carbs || 0;
      acc.fats += l.fats || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Today</h1>

        <button
          onClick={() => navigate("/diet/log/new")}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          + Log Food
        </button>
      </div>

      {/* Today Totals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Calories" value={`${totals.calories} kcal`} />
        <Stat label="Protein" value={`${totals.protein} g`} />
        <Stat label="Carbs" value={`${totals.carbs} g`} />
        <Stat label="Fats" value={`${totals.fats} g`} />
      </div>

      <div
  onClick={() => navigate("/diet/recipes")}
  className="cursor-pointer bg-white rounded-2xl p-4 shadow
             hover:shadow-lg transition"
>
  <p className="text-lg font-semibold">Recipes</p>
  <p className="text-sm text-gray-500">
    Browse all recipes
  </p>
</div>


      {/* Today Logs */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3">Today’s Logs</h2>

        {logs.length === 0 ? (
          <p className="text-sm text-gray-500">No food logged today.</p>
        ) : (
          <div className="space-y-2 text-sm">
            {logs.map((l) => (
              <div key={l._id} className="flex justify-between">
                <span>{l.mealType}</span>
                <span>{l.calories} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Analytics */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3">This Month</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <MiniStat label="Avg" value={`${monthly.averageCalories} kcal`} />
          <MiniStat label="Max" value={`${monthly.maxCalories} kcal`} />
          <MiniStat label="Min" value={`${monthly.minCalories} kcal`} />
          <MiniStat label="Days Logged" value={monthly.daysLogged} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
