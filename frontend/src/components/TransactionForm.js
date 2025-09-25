import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { suggestCategory } from "../utils/categorySuggester";
import { addTransaction } from "../services/api";
import socket from "../socket";

export default function TransactionForm({ onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [payment, setPayment] = useState("cash");

  // Gợi ý category dựa trên note
  useEffect(() => {
    const suggested = suggestCategory(description);
    setCategory(suggested);
  }, [description]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTx = {
        description,
        amount: Number(amount),
        type,
        category,
        date,
        payment,
      };

      const saved = await addTransaction(newTx);

      // 🔥 Phát socket để list đồng bộ ngay
      const userId = localStorage.getItem("userId");
      if (userId) {
        socket.emit("transaction:created", { userId, data: saved });
      }

      toast.success("Transaction added successfully!");
      if (onAdd) onAdd(saved); // fallback update App state

      // Reset form
      setDescription("");
      setAmount("");
      setCategory("");
      setDate(new Date().toISOString().slice(0, 10));
      setPayment("cash");
      setType("expense");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add transaction!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => {
          const val = e.target.value;
          if (val >= 0) setAmount(val);
        }}
        className="w-full p-2 border rounded"
        min="0"
        step="0.01"
        required
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

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <select
        value={payment}
        onChange={(e) => setPayment(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="cash">Cash</option>
        <option value="credit">Credit Card</option>
        <option value="bank">Bank Transfer</option>
        <option value="ewallet">E-Wallet</option>
      </select>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Transaction
      </button>
    </form>
  );
}
