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
        api.get(
          `/finance/analytics/monthly?year=${year}&month=${month}`
        ),
      ]);

      setNet(netRes.data.net);
      setMonthly(monthlyRes.data);
    } catch (err) {
      console.error("Finance summary failed", err);
    } finally {
      setLoading(false); // 🔥 THIS WAS MISSING
    }
  };

  fetchSummary();
}, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading finance...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Finance</h1>
        <button
          onClick={() => navigate("/finance/transactions/new")}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
        >
          + Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card label="Net Balance" value={`₹${net}`} />
        <Card label="Income" value={`₹${monthly?.income || 0}`} />
        <Card label="Expense" value={`₹${monthly?.expense || 0}`} />
        <Card label="Savings" value={`₹${(monthly?.income || 0) - (monthly?.expense || 0)}`} />
      </div>

      <div className="flex gap-4">
        <NavBox label="Transactions" onClick={() => navigate("/finance/transactions")} />
        <NavBox label="Accounts" onClick={() => navigate("/finance/accounts")} />
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function NavBox({ label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex-1 bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
    >
      <p className="font-semibold">{label}</p>
    </div>
  );
}
