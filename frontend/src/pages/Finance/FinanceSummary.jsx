import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function FinanceSummary() {
  const [net, setNet] = useState(0);
  const [monthly, setMonthly] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const fetchSummary = async () => {
      try {
        const [netRes, monthlyRes] = await Promise.all([
          api.get(`/finance/analytics/netbalance?year=${year}&month=${month}`),
          api.get(`/finance/analytics/monthly?year=${year}&month=${month}`),
        ]);

        setNet(netRes.data.net);
        setMonthly(monthlyRes.data);
      } catch (err) {
        console.error("Finance summary failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading finance…
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-200">
          Finance
        </h1>

        <button
          onClick={() => navigate("/finance/transactions/new")}
          className="
            px-4 py-2 rounded-lg
            bg-emerald-500 text-black font-semibold
            hover:bg-emerald-400
            transition active:scale-95
          "
        >
          + Add Transaction
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Net Balance" value={`₹${net}`} />
        <StatCard label="Income" value={`₹${monthly?.income || 0}`} />
        <StatCard label="Expense" value={`₹${monthly?.expense || 0}`} />
        <StatCard
          label="Savings"
          value={`₹${(monthly?.income || 0) - (monthly?.expense || 0)}`}
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <NavBox
          label="Transactions"
          onClick={() => navigate("/finance/transactions")}
        />
        <NavBox
          label="Accounts"
          onClick={() => navigate("/finance/accounts")}
        />
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({ label, value }) {
  return (
    <div
      className="
        rounded-xl border border-slate-700 bg-slate-800
        p-4 space-y-1
        transition
        hover:translate-y-[-2px] hover:border-slate-600
      "
    >
      <p className="text-sm text-slate-400">
        {label}
      </p>
      <p className="text-lg font-semibold text-slate-100">
        {value}
      </p>
    </div>
  );
}

function NavBox({ label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        flex-1 rounded-xl border border-slate-700 bg-slate-800
        p-4 cursor-pointer
        transition
        hover:translate-y-[-2px] hover:border-slate-600
        active:scale-95
      "
    >
      <p className="font-semibold text-slate-100">
        {label}
      </p>
      <p className="text-sm text-slate-400 mt-1">
        View {label.toLowerCase()}
      </p>
    </div>
  );
}
