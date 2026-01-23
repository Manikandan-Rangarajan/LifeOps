import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Transactions() {
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    api.get("/finance/transaction").then((res) => {
      setTxns(res.data.transactions || res.data);
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-200">
        Transactions
      </h1>

      {txns.length === 0 && (
        <p className="text-slate-400">
          No transactions yet.
        </p>
      )}

      <div className="space-y-3">
        {txns.map((t) => (
          <div
            key={t._id}
            className="
              rounded-xl border border-slate-700 bg-slate-800
              p-4 flex justify-between items-center
              transition
              hover:translate-y-[-2px] hover:border-slate-600
            "
          >
            {/* Left */}
            <div>
              <p className="font-medium text-slate-100">
                {t.category}
              </p>
              <p className="text-sm text-slate-400">
                {new Date(t.date).toDateString()}
              </p>
            </div>

            {/* Amount */}
            <div
              className={`font-semibold text-lg ${
                t.type === "EXPENSE"
                  ? "text-red-400"
                  : "text-emerald-400"
              }`}
            >
              {t.type === "EXPENSE" ? "-" : "+"}₹{t.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
