import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function formatToInputDate(d) {
  if (!d) return new Date().toISOString().slice(0, 10);
  const date = new Date(d);
  if (isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

export default function EditTransactionModal({
  transaction,
  onClose,
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState({
    description: transaction?.description || "",
    category: transaction?.category || "",
    type: transaction?.type || "expense",
    amount:
      transaction?.amount !== undefined && transaction?.amount !== null
        ? String(transaction.amount)
        : "",
    date: formatToInputDate(transaction?.date),
    payment: transaction?.payment || "cash",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Không cho nhập số âm cho amount
    if (name === "amount") {
      // cho phép xóa để rỗng
      if (value === "") {
        setForm((prev) => ({ ...prev, amount: "" }));
        return;
      }
      // nếu không phải số thì bỏ
      const num = Number(value);
      if (isNaN(num)) return;
      if (num < 0) return;
      setForm((prev) => ({ ...prev, amount: value }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!form.category.trim()) {
      toast.error("Category is required");
      return;
    }
    if (form.amount === "" || Number(form.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    if (!form.date) {
      toast.error("Date is required");
      return;
    }

    // Prepare payload
    const payload = {
      description: form.description.trim(),
      category: form.category.trim(),
      type: form.type,
      amount: Number(form.amount),
      date: new Date(form.date), // backend expects Date
      paymentMethod: form.paymentMethod,
    };

    try {
      await onSubmit(payload);
      toast.success("Transaction updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update transaction");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Edit Transaction</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded"
            required
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 rounded"
            required
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
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="border p-2 rounded"
            min="0"
            required
          />

          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="cash">Cash</option>
            <option value="credit">Credit Card</option>
            <option value="bank">Bank Transfer</option>
            <option value="ewallet">E-Wallet</option>
          </select>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
