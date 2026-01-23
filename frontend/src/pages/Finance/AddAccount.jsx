import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useNotification } from "../../components/NotificationContext";

export default function AddAccount() {
  const [form, setForm] = useState({
    name: "",
    type: "CASH",
    currency: "INR",
  });

  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/finance/account", form);
      showNotification("Account created");
      navigate("/finance");
    } catch (err) {
      console.error(err);
      showNotification("Failed to create account", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md space-y-4
          rounded-xl border border-slate-700 bg-slate-800
          p-6
        "
      >
        <h1 className="text-xl font-semibold text-slate-100">
          Add Account
        </h1>

        {/* Name */}
        <input
          name="name"
          placeholder="Account name (eg. HDFC, Cash)"
          value={form.name}
          onChange={handleChange}
          required
          className="
            w-full rounded border border-slate-600
            bg-slate-900 p-2 text-slate-100
          "
        />

        {/* Type */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="
            w-full rounded border border-slate-600
            bg-slate-900 p-2 text-slate-100
          "
        >
          <option value="CASH">CASH</option>
          <option value="BANK">BANK</option>
          <option value="CARD">CARD</option>
          <option value="WALLET">WALLET</option>
          <option value="STOCKS">STOCKS</option>
          <option value="MFS">MFS</option>
        </select>

        {/* Currency */}
        <input
          name="currency"
          value={form.currency}
          onChange={handleChange}
          className="
            w-full rounded border border-slate-600
            bg-slate-900 p-2 text-slate-100
          "
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              px-4 py-2 rounded-lg
              border border-slate-600
              text-slate-300 hover:bg-slate-700
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            className="
              px-4 py-2 rounded-lg
              bg-emerald-500 text-black font-semibold
              hover:bg-emerald-400
              transition active:scale-95
            "
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
