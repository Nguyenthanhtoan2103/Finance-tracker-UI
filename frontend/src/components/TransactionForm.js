import React, { useState } from "react";
import { toast } from "react-toastify";

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "",
  });

  const submit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount)
      return toast.error("Please enter description and amount");

    const payload = { ...form, amount: Number(form.amount) };
    if (onAdd) {
      onAdd(payload);
      toast.success("Transaction added successfully!");
    }

    setForm({ description: "", amount: "", type: "expense", category: "" });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        ➕ Add Transaction
      </h3>
      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <select
          className="w-full border rounded px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
