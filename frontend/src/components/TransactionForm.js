import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../services/socket";

export default function TransactionForm() {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    amount: "",
    category: "",
    type: "expense",
    description: "",
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

    if (!user) {
      toast.error("⚠️ You must log in to add a transaction!");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/transactions`,
        { ...form, user: user._id },
        { withCredentials: true }
      );

      toast.success("✅ Transaction added successfully!");

      // Emit realtime update
      socket.emit("transaction:new", {
        userId: user._id,
        transaction: res.data,
      });

      // Reset form
      setForm({
        amount: "",
        category: "",
        type: "expense",
        description: "",
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
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
        className="border p-2 rounded"
      />

      <input
        type="text"
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category (e.g. Food, Transport)"
        required
        className="border p-2 rounded"
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="text"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 rounded"
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />

      <select
        name="payment"
        value={form.payment}
        onChange={handleChange}
        className="border p-2 rounded"
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
