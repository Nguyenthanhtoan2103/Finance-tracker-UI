import React, { useState, useMemo, useEffect } from "react";
import { Trash2, Edit3 } from "lucide-react";
import { toast } from "react-toastify";
import EditTransactionModal from "./EditTransactionModal";
import { updateTransaction } from "../services/api";
import { io } from "socket.io-client";

// ⚡ Kết nối socket
const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
  transports: ["websocket"],
});

export default function TransactionList({ transactions = [], onDelete, onRefresh }) {
  const [localTransactions, setLocalTransactions] = useState(transactions);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Đồng bộ prop -> state
  useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  // ✅ Realtime với Socket.IO
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    socket.on(`transaction:${userId}`, (msg) => {
      console.log("Realtime update:", msg);

      if (msg.action === "created") {
        setLocalTransactions((prev) => [msg.data, ...prev]);
        toast.info("✨ New transaction added!");
      }
      if (msg.action === "updated") {
        setLocalTransactions((prev) =>
          prev.map((t) => (t._id === msg.data._id ? msg.data : t))
        );
        toast.success("✅ Transaction updated!");
      }
      if (msg.action === "deleted") {
        setLocalTransactions((prev) =>
          prev.filter((t) => t._id !== msg.data._id)
        );
        toast.warn("🗑️ Transaction deleted!");
      }
    });

    return () => {
      socket.off(`transaction:${userId}`);
    };
  }, []);

  // ✅ Cập nhật transaction
  const handleUpdate = async (data) => {
    if (!editing) return;
    setLoading(true);
    try {
      await updateTransaction(editing._id || editing.id, data);
      toast.success("Transaction updated successfully!");
      setEditing(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Xoá có confirm Toast
  const handleDelete = (t) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col">
          <span>
            Are you sure to delete <b>{t.description || "transaction"}</b>?
          </span>
          <div className="mt-2 flex gap-2">
            <button
              onClick={async () => {
                try {
                  await onDelete(t._id || t.id);
                  toast.success("Deleted successfully!");
                } catch (err) {
                  console.error(err);
                  toast.error("Delete failed!");
                }
                closeToast();
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  // ✅ Lọc transaction theo search
  const filteredTransactions = useMemo(() => {
    return localTransactions.filter((t) => {
      const term = searchTerm.toLowerCase();
      return (
        (t.description && t.description.toLowerCase().includes(term)) ||
        (t.category && t.category.toLowerCase().includes(term)) ||
        (t.payment && t.payment.toLowerCase().includes(term))
      );
    });
  }, [localTransactions, searchTerm]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by description, category, or payment..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Bảng */}
      {filteredTransactions.length === 0 ? (
        <div className="text-gray-500 text-sm">No transactions found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Payment</th>
                <th className="px-4 py-2 text-left">Date</th>
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
                  <td className="px-4 py-2 font-semibold">
                    {t.amount?.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="px-4 py-2">{t.payment || "-"}</td>
                  <td className="px-4 py-2">
                    {t.date ? new Date(t.date).toLocaleDateString("vi-VN") : "-"}
                  </td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    <button
                      onClick={() => setEditing(t)}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(t)}
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

      {/* Modal edit */}
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
