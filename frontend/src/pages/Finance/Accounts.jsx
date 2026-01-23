import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/finance/account").then((res) => {
      setAccounts(res.data.accounts || res.data);
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-200">
          Accounts
        </h1>

        <button
          onClick={() => navigate("/finance/accounts/new")}
          className="
            px-4 py-2 rounded-lg
            bg-emerald-500 text-black font-semibold
            hover:bg-emerald-400
            transition active:scale-95
          "
        >
          + Add Account
        </button>
      </div>

      {/* List */}
      {accounts.length === 0 ? (
        <p className="text-slate-400">
          No accounts yet.
        </p>
      ) : (
        <div className="space-y-3">
          {accounts.map((a) => (
            <AccountCard key={a._id} account={a} />
          ))}
        </div>
      )}
    </div>
  );
}

function AccountCard({ account }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    api
      .get(`/finance/account/${account._id}/balance`)
      .then((res) => {
        setBalance(res.data.balance || 0);
      });
  }, [account._id]);

  return (
    <div
      className="
        rounded-xl border border-slate-700 bg-slate-800
        p-4 flex justify-between items-center
        transition hover:border-slate-600
      "
    >
      <div>
        <p className="font-medium text-slate-100">
          {account.name}
        </p>
        <p className="text-sm text-slate-400">
          {account.type}
        </p>
      </div>

      <div className="font-semibold text-slate-100">
        ₹{balance}
      </div>
    </div>
  );
}
