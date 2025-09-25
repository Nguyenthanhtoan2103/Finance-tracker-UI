import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { socket } from "../services/socket";
import { suggestCategory } from "../utils/categorySuggester";

export default function TransactionForm({ user }) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "expense",   // expense | income
    category: "",
    date: new Date().toISOString().slice(0, 10),
    payment: "cash",   // cash | credit | bank | ewallet
  });
  const [loading, setLoading] = useState(false);

  // Gợi ý category dựa vào description
  useEffect(() => {
    const suggested = suggestCategory(form.description);
    if (suggested) {
      setForm((prev) => ({ ...prev, category: suggested }));
    }
  }, [form.description]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error("❌ User not found, cannot submit transaction");
      toast.error("You must be logged in to add a transaction");
      return;
    }

    try {
      setLoading(true);

      const payload = { ...form, user: user._id };
      console.log("📤 Sending payload to backend:", payload);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/transactions`,
        payload,
        { withCredentials: true }
      );

      console.log("✅ Backend response:", res.data);

      // Emit socket event
      socket.emit("transaction:new", {
        userId: user._id,
        data: res.data,
      });
      console.log("📡 Socket emitted transaction:new", {
        userId: user._id,
        data: res.data,
      });

      toast.success("Transaction added successfully!");

      // Reset form
      setForm({
        description: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().slice(0, 10),
        payment: "cash",
      });
    } catch (err) {
      console.error("❌ Error submitting transaction:", err.response || err);
      toast.error(
        err.response?.data?.message || "Failed to add transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-4 space-y-3"
    >
      <h2 className="text-lg font-bold">Add Transaction</h2>

      <input
        type="text"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        min="0"
        step="0.01"
        required
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />

      <select
        name="payment"
        value={form.payment}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      >
        <option value="cash">Cash</option>
        <option value="credit">Credit Card</option>
        <option value="bank">Bank Transfer</option>
        <option value="ewallet">E-Wallet</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Transaction"}
      </button>
    </form>
  );
}
