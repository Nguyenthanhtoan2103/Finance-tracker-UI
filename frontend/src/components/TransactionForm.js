import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../services/socket";

export default function TransactionForm() {
  const { isLoggedIn } = useContext(AuthContext);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().slice(0, 10),
    payment: "cash",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("⚠️ Please log in to add a transaction!");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/transactions`,
        { ...form },
        { withCredentials: true }
      );

      toast.success("✅ Transaction added successfully!");

      // Emit realtime update
      socket.emit("transaction:new", {
        transaction: res.data,
      });

      // Reset form
      setForm({
        description: "",
        amount: "",
        category: "",
        type: "expense",
        date: new Date().toISOString().slice(0, 10),
        payment: "cash",
      });
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add transaction!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow rounded-lg flex flex-col gap-3"
    >
      <h2 className="text-lg font-bold">➕ Add Transaction</h2>

      <input
        type="text"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 rounded w-full"
        required
      />

      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
        min="0"
        step="0.01"
        className="border p-2 rounded w-full"
      />

      <input
        type="text"
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        className="border p-2 rounded w-full"
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
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      />

      <select
        name="payment"
        value={form.payment}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="cash">Cash</option>
        <option value="credit">Credit Card</option>
        <option value="bank">Bank Transfer</option>
        <option value="ewallet">E-Wallet</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Transaction"}
      </button>
    </form>
  );
}
