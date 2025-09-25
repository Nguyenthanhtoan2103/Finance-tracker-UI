import React, { useState } from "react";
import { socket } from "../services/socket";
import axios from "axios";

export default function TransactionForm() {
  const userId = localStorage.getItem("userId"); // ✅ lấy từ localStorage
  const [form, setForm] = useState({
    amount: "",
    category: "",
    type: "expense",
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
    if (!userId) return;

    try {
      setLoading(true);

      // Gửi qua REST API (để đảm bảo lưu DB ổn định)
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/transactions`,
        {
          ...form,
          user: userId,
        }
      );

      // Sau khi lưu thành công, emit socket để realtime
      socket.emit("newTransaction", {
        userId,
        data: res.data, // transaction đã lưu
      });

      setForm({ amount: "", category: "", type: "expense" });
    } catch (err) {
      console.error("Error adding transaction:", err);
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
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className="border p-2 rounded w-full"
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
