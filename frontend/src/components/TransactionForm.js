import React, { useState, useEffect } from "react";
import { suggestCategory } from "../utils/categorySuggester";

export default function TransactionForm({ onAdd }) {
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");

  // Khi note thay đổi, gợi ý category
  useEffect(() => {
    const suggested = suggestCategory(note);
    setCategory(suggested);
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ note, amount: Number(amount), type, category });
    setNote("");
    setAmount("");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Description"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input
        type="text"
        value={category}
        placeholder="Category (AI suggestion)"
        readOnly
        className="w-full p-2 border rounded bg-gray-100"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Add Transaction
      </button>
    </form>
  );
}
