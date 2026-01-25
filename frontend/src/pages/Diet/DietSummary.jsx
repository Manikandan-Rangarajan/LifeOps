import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

/* ---------- Chart.js INLINE ---------- */
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);
/* ----------------------------------- */

export default function DietSummary() {
  const [logs, setLogs] = useState([]);
  const [monthly, setMonthly] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    const fetchData = async () => {
      try {
        const [logRes, monthlyRes, weeklyRes] = await Promise.all([
          api.get(`/diet/log?date=${today}`),
          api.get(
            `/diet/log/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
          ),
          api.get("/diet/log/weekly"),
        ]);

        setLogs(logRes.data.log || []);
        setMonthly(monthlyRes.data);
        setWeekly(weeklyRes.data.data || []);
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
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading diet summary…
      </div>
    );
  }

  /* ---------- DAILY TOTALS ---------- */
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

  const hasMacros =
    totals.protein + totals.carbs + totals.fats > 0;

  /* ---------- PIE CHART (MACROS) ---------- */
  const pieData = {
    labels: ["Protein (g)", "Carbs (g)", "Fats (g)"],
    datasets: [
      {
        data: [totals.protein, totals.carbs, totals.fats],
        backgroundColor: [
          "#4ade80", // protein - green
          "#60a5fa", // carbs - blue
          "#fbbf24", // fats - amber
        ],
        borderColor: "#020617",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#e5e7eb" },
      },
    },
  };

  /* ---------- WEEKLY BAR CHART (HISTOGRAM STYLE) ---------- */
  const barData = {
    labels: weekly.map((d) => d.day),
    datasets: [
      {
        label: "Calories",
        data: weekly.map((d) => d.calories),
        backgroundColor: "#38bdf8",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} kcal`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5f5" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#cbd5f5" },
        grid: { color: "#1e293b" },
      },
    },
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-200">
          Diet Summary
        </h1>

        <button
          onClick={() => navigate("/diet/log/new")}
          className="
            px-4 py-2 rounded-lg
            bg-emerald-500 text-black font-semibold
            hover:bg-emerald-400
            transition active:scale-95
          "
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

      {/* DAILY MACRO PIE */}
<div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
  <h2 className="font-semibold text-slate-100 mb-3 text-sm">
    Today’s Macro Split
  </h2>

  {hasMacros ? (
    <div className="max-w-xs mx-auto">
      <Pie
        data={pieData}
        options={{
          ...pieOptions,
          maintainAspectRatio: false,
        }}
        height={220}
      />
    </div>
  ) : (
    <p className="text-xs text-slate-400">
      No macro data today 🍽️
    </p>
  )}
</div>

      {/* WEEKLY CALORIE HISTOGRAM */}
<div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
  <h2 className="font-semibold text-slate-100 mb-3 text-sm">
    Weekly Calorie Trend
  </h2>

  {weekly.length > 0 ? (
    <div className="max-w-2xl mx-auto">
      <Bar
        data={barData}
        options={{
          ...barOptions,
          maintainAspectRatio: false,
        }}
        height={180}
      />
    </div>
  ) : (
    <p className="text-xs text-slate-400">
      Not enough data for weekly trend.
    </p>
  )}
</div>


      {/* Monthly Analytics */}
      {monthly && (
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <h2 className="font-semibold text-slate-100 mb-3">
            This Month
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <MiniStat label="Avg" value={`${monthly.averageCalories} kcal`} />
            <MiniStat label="Max" value={`${monthly.maxCalories} kcal`} />
            <MiniStat label="Min" value={`${monthly.minCalories} kcal`} />
            <MiniStat label="Days Logged" value={monthly.daysLogged} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Components ---------- */

function Stat({ label, value }) {
  return (
    <div className="
      rounded-xl border border-slate-700 bg-slate-800
      p-4 text-center transition
      hover:translate-y-[-2px] hover:border-slate-600
    ">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-lg font-semibold text-slate-100">
        {value}
      </p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-semibold text-slate-100">
        {value}
      </p>
    </div>
  );
}
