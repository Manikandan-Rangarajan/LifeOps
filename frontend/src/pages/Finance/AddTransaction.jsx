import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AddTransaction() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    type: "EXPENSE",
    amount: "",
    category: "",
    accountId: "",
    note: "",
    date: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/finance/account").then((res) => {
      setAccounts(res.data.accounts || res.data);
    });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/finance/transaction", {
      ...form,
      amount: Number(form.amount),
      date: form.date || new Date(),   
});
console.log("Submitting transaction:", {
  ...form,
  amount: Number(form.amount),
  date: form.date || new Date(),
});

    navigate("/finance");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-3"
      >
        <h1 className="text-xl font-semibold">Add Transaction</h1>

        <select name="type" onChange={handleChange} className="w-full border p-2 rounded">
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>

        <input name="amount" type="number" placeholder="Amount" required onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="category" placeholder="Category" required onChange={handleChange} className="w-full border p-2 rounded" />

        <select name="accountId" required onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">Select Account</option>
          {accounts.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name}
            </option>
          ))}
        </select>

        <input name="date" type="date" onChange={handleChange} className="w-full border p-2 rounded" />

        <textarea name="note" placeholder="Note (optional)" onChange={handleChange} className="w-full border p-2 rounded" />

        <button className="w-full bg-emerald-500 text-white py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
