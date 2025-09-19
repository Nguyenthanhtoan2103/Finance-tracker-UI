import React, { useState, useMemo } from "react";
import { Trash2, Edit3 } from "lucide-react";
import EditTransactionModal from "./EditTransactionModal";
import { updateTransaction } from "../services/api";

export default function TransactionList({ transactions = [], onDelete }) {
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // state search

  // Xử lý update transaction
  const handleUpdate = async (data) => {
    if (!editing) return;
    setLoading(true);
    try {
      const res = await updateTransaction(editing._id || editing.id, data);
      const index = transactions.findIndex((t) => t._id === res.data._id);
      if (index !== -1) {
        transactions[index] = res.data;
      }
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Lọc transactions dựa trên searchTerm
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const term = searchTerm.toLowerCase();
      return (
        (t.description && t.description.toLowerCase().includes(term)) ||
        (t.category && t.category.toLowerCase().includes(term))
      );
    });
  }, [transactions, searchTerm]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4">Transactions</h3>

      {/* Input search */}
      <input
        type="text"
        placeholder="Search by description or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {filteredTransactions.length === 0 ? (
        <div className="text-gray-500 text-sm">No transactions</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr
                  key={t._id || t.id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{t.description}</td>
                  <td className="px-4 py-2 text-gray-600">{t.category || "-"}</td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      t.type === "income" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {t.type}
                  </td>
                  <td className="px-4 py-2 font-semibold">{t.amount.toLocaleString()} ₫</td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    <button
                      onClick={() => setEditing(t)}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(t._id || t.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gọi modal edit */}
      {editing && (
        <EditTransactionModal
          transaction={editing}
          onClose={() => setEditing(null)}
          onSubmit={handleUpdate}
          loading={loading}
        />
      )}
    </div>
  );
}
