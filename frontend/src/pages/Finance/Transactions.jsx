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
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Transactions</h1>

      {txns.map((t) => (
        <div
          key={t._id}
          className="bg-white rounded-xl shadow p-4 flex justify-between"
        >
          <div>
            <p className="font-medium">{t.category}</p>
            <p className="text-sm text-slate-500">
              {new Date(t.date).toDateString()}
            </p>
          </div>

          <div
            className={`font-semibold ${
              t.type === "EXPENSE" ? "text-red-500" : "text-emerald-500"
            }`}
          >
            {t.type === "EXPENSE" ? "-" : "+"}₹{t.amount}
          </div>
        </div>
      ))}
    </div>
  );
}
