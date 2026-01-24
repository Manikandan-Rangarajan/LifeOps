import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useNotification } from "../../components/NotificationContext";

export default function AddTransaction() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    type: "EXPENSE",
    amount: "",
    category: "",
    accountId: "",
    note: "",
    date: ""
  });

  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Fetch accounts
  useEffect(() => {
    api
      .get("/finance/account")
      .then((res) => {
        setAccounts(res.data.accounts || res.data);
      })
      .catch(() => {
        showNotification("Failed to load accounts", "error");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.accountId || !form.amount || !form.category) {
      showNotification("Please fill all required fields", "error");
      return;
    }

    const payload = {
      accountId: form.accountId,
      amount: Number(form.amount), // ALWAYS positive
      type: form.type,             // EXPENSE / INCOME
      category: form.category,
      note: form.note,
      date: form.date || new Date().toISOString()
    };

    try {
      setLoading(true);
      await api.post("/finance/transaction", payload);
      showNotification("Transaction added successfully");
      navigate("/finance");
    } catch (err) {
      showNotification(
        err?.response?.data?.message || "Failed to add transaction",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">
          Add Transaction
        </h1>

        {/* TYPE */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>

        {/* AMOUNT */}
        <input
          name="amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          required
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* CATEGORY */}
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          required
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* ACCOUNT */}
        <select
          name="accountId"
          value={form.accountId}
          required
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Account</option>
          {accounts.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.name}
            </option>
          ))}
        </select>

        {/* DATE */}
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* NOTE */}
        <textarea
          name="note"
          placeholder="Note (optional)"
          value={form.note}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={3}
        />

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/finance")}
            className="flex-1 border py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
