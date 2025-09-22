import React, { useEffect, useState } from "react";
import { getBudgets, setBudget } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BudgetManager() {
  const [budgets, setBudgets] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");

  const loadBudgets = async () => {
    try {
      const res = await getBudgets();
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load budgets!");
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleAddBudget = async () => {
    if (!newCategory || !newLimit) {
      toast.warning("Please fill in all fields!");
      return;
    }

    try {
      await setBudget({ category: newCategory, limit: Number(newLimit) });
      toast.success("Budget saved successfully!");
      setNewCategory("");
      setNewLimit("");
      loadBudgets();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save budget!");
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Budget Manager</h2>

      {/* Form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="number"
          placeholder="Limit"
          value={newLimit}
          onChange={(e) => {
            const val = e.target.value;
            if (val >= 0 || val === "") setNewLimit(val);
          }}
          className="border p-2 rounded w-32"
          min="0"
        />

        <button
          onClick={handleAddBudget}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition"
        >
          Add / Update
        </button>
      </div>

      {/* List */}
      {budgets.length === 0 ? (
        <p className="text-gray-500">No budgets yet</p>
      ) : (
        budgets.map((b) => {
          let color = "bg-green-400";
          if (b.progress > 100) color = "bg-red-500";
          else if (b.progress > 80) color = "bg-yellow-400";

          return (
            <div key={b.category} className="mb-4">
              <div className="flex justify-between mb-1 font-medium">
                <span>{b.category}</span>
                <span>
                  {b.spent.toLocaleString()} / {b.limit.toLocaleString()} ₫
                </span>
              </div>
              <div className="w-full bg-gray-200 h-5 rounded-lg">
                <div
                  style={{ width: `${Math.min(b.progress, 100)}%` }}
                  className={`${color} h-5 rounded-lg transition-all`}
                />
              </div>
              {b.progress >= 80 && b.progress <= 100 && (
                <p className="text-yellow-600 text-sm mt-1">
                  Almost reached the budget limit!
                </p>
              )}
              {b.progress > 100 && (
                <p className="text-red-600 text-sm mt-1">Budget exceeded!</p>
              )}
            </div>
          );
        })
      )}

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
