import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    api.get("/finance/account").then((res) => {
      setAccounts(res.data.accounts || res.data);
    });
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Accounts</h1>

      {accounts.map((a) => (
        <AccountCard key={a._id} account={a} />
      ))}
    </div>
  );
}

function AccountCard({ account }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    api.get(`/finance/account/${account._id}/balance`).then((res) => {
      setBalance(res.data.balance || 0);
    });
  }, [account._id]);

  return (
    <div className="bg-white rounded-xl shadow p-4 flex justify-between">
      <div>
        <p className="font-medium">{account.name}</p>
        <p className="text-sm text-slate-500">{account.type}</p>
      </div>
      <div className="font-semibold">₹{balance}</div>
    </div>
  );
}
