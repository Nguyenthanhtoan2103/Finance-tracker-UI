// import React, { useState, useMemo, useEffect } from "react";
// import { Trash2, Edit3 } from "lucide-react";
// import { toast } from "react-toastify";
// import EditTransactionModal from "./EditTransactionModal";
// import { updateTransaction, deleteTransaction } from "../services/api";
// import {socket} from "../services/socket";

// export default function TransactionList({ transactions = [], onRefresh }) {
//   const [localTransactions, setLocalTransactions] = useState(transactions);
//   const [editing, setEditing] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // ✅ Đồng bộ prop -> state
//   useEffect(() => {
//     setLocalTransactions(transactions);
//   }, [transactions]);

//   // ✅ Socket realtime
//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) return;

//     socket.on(`transaction:${userId}`, (msg) => {
//       console.log("Realtime update:", msg);

//       if (msg.action === "created") {
//         setLocalTransactions((prev) => [msg.data, ...prev]);
       
//       }
//       if (msg.action === "updated") {
//         setLocalTransactions((prev) =>
//           prev.map((t) => (t._id === msg.data._id ? msg.data : t))
//         );
       
//       }
//       if (msg.action === "deleted") {
//         setLocalTransactions((prev) =>
//           prev.filter((t) => t._id !== msg.data._id)
//         );
   
//       }
//     });

//     return () => {
//       socket.off(`transaction:${userId}`);
//     };
//   }, []);

//   // ✅ Update transaction
//   const handleUpdate = async (data) => {
//     if (!editing) return;
//     setLoading(true);
//     try {
//       const updated = await updateTransaction(editing._id, data);

//       // 🔥 Phát socket update
//       const userId = localStorage.getItem("userId");
//       if (userId) {
//         socket.emit("transaction:updated", { userId, data: updated });
//       }

//       toast.success("Transaction updated successfully!");
//       setEditing(null);
//       if (onRefresh) onRefresh();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update transaction");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Delete transaction
//   const handleDelete = (t) => {
//     toast(
//       ({ closeToast }) => (
//         <div className="flex flex-col">
//           <span>
//             Are you sure to delete <b>{t.description || "transaction"}</b>?
//           </span>
//           <div className="mt-2 flex gap-2">
//             <button
//               onClick={async () => {
//                 try {
//                   await deleteTransaction(t._id);

//                   // 🔥 Phát socket delete
//                   const userId = localStorage.getItem("userId");
//                   if (userId) {
//                     socket.emit("transaction:deleted", { userId, data: t });
//                   }

//                   toast.success("Deleted successfully!");
//                   if (onRefresh) onRefresh();
//                 } catch (err) {
//                   console.error(err);
//                   toast.error("Delete failed!");
//                 }
//                 closeToast();
//               }}
//               className="bg-red-500 text-white px-3 py-1 rounded"
//             >
//               Delete
//             </button>
//             <button
//               onClick={closeToast}
//               className="bg-gray-300 px-3 py-1 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ),
//       { autoClose: false }
//     );
//   };

//   // ✅ Lọc transaction theo search
//   const filteredTransactions = useMemo(() => {
//     return localTransactions.filter((t) => {
//       const term = searchTerm.toLowerCase();
//       return (
//         (t.description && t.description.toLowerCase().includes(term)) ||
//         (t.category && t.category.toLowerCase().includes(term)) ||
//         (t.payment && t.payment.toLowerCase().includes(term))
//       );
//     });
//   }, [localTransactions, searchTerm]);

//   return (
//     <div className="bg-white shadow-md rounded-xl p-4">
//       {/* 🔍 Search */}
//       <input
//         type="text"
//         placeholder="Search by description, category, or payment..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       {/* Table */}
//       {filteredTransactions.length === 0 ? (
//         <div className="text-gray-500 text-sm">No transactions found</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
//               <tr>
//                 <th className="px-4 py-2 text-left">Description</th>
//                 <th className="px-4 py-2 text-left">Category</th>
//                 <th className="px-4 py-2 text-left">Type</th>
//                 <th className="px-4 py-2 text-left">Amount</th>
//                 <th className="px-4 py-2 text-left">Payment</th>
//                 <th className="px-4 py-2 text-left">Date</th>
//                 <th className="px-4 py-2 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTransactions.map((t) => (
//                 <tr
//                   key={t._id}
//                   className="border-b last:border-none hover:bg-gray-50"
//                 >
//                   <td className="px-4 py-2">{t.description}</td>
//                   <td className="px-4 py-2 text-gray-600">{t.category || "-"}</td>
//                   <td
//                     className={`px-4 py-2 font-medium ${
//                       t.type === "income" ? "text-green-600" : "text-red-500"
//                     }`}
//                   >
//                     {t.type}
//                   </td>
//                   <td className="px-4 py-2 font-semibold">
//                     {t.amount?.toLocaleString("vi-VN")} ₫
//                   </td>
//                   <td className="px-4 py-2">{t.payment || "-"}</td>
//                   <td className="px-4 py-2">
//                     {t.date ? new Date(t.date).toLocaleDateString("vi-VN") : "-"}
//                   </td>
//                   <td className="px-4 py-2 text-center flex justify-center gap-2">
//                     <button
//                       onClick={() => setEditing(t)}
//                       className="text-blue-500 hover:text-blue-700 transition"
//                     >
//                       <Edit3 size={18} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(t)}
//                       className="text-red-500 hover:text-red-700 transition"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal edit */}
//       {editing && (
//         <EditTransactionModal
//           transaction={editing}
//           onClose={() => setEditing(null)}
//           onSubmit={handleUpdate}
//           loading={loading}
//         />
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState, useMemo } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import EditTransactionModal from "./EditTransactionModal";
import { updateTransaction, deleteTransaction } from "../services/api";
import { socket } from "../services/socket";

export default function TransactionList({ transactions = [], onRefresh }) {
  const [localTransactions, setLocalTransactions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Paging ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Init từ props (sort desc theo date) ---
  useEffect(() => {
    setLocalTransactions(
      [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
    );
  }, [transactions]);

  // --- Socket realtime ---
  useEffect(() => {
    const handler = (msg) => {
      console.log("📩 TransactionList realtime:", msg);

      if (msg.action === "created") {
        setLocalTransactions((prev) =>
          [msg.data, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      }
      if (msg.action === "updated") {
        setLocalTransactions((prev) =>
          prev
            .map((t) => (t._id === msg.data._id ? msg.data : t))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      }
      if (msg.action === "deleted") {
        setLocalTransactions((prev) =>
          prev.filter((t) => t._id !== msg.data._id)
        );
      }
    };

    socket.on("transaction:update", handler);
    return () => socket.off("transaction:update", handler);
  }, []);

  // --- Update transaction ---
  const handleUpdate = async (data) => {
    if (!editing) return;
    setLoading(true);
    try {
      await updateTransaction(editing._id, data);
      toast.success("Transaction updated!");
      setEditing(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  // --- Delete transaction ---
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
                  await deleteTransaction(t._id);
                  toast.success("Deleted successfully!");
                  if (onRefresh) onRefresh();
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

  // --- Search filter ---
  const filteredTransactions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return localTransactions.filter(
      (t) =>
        (t.description && t.description.toLowerCase().includes(term)) ||
        (t.category && t.category.toLowerCase().includes(term)) ||
        (t.payment && t.payment.toLowerCase().includes(term))
    );
  }, [localTransactions, searchTerm]);

  // --- Pagination ---
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Reset page khi search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filteredTransactions]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by description, category, or payment..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Table */}
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
              {paginatedTransactions.map((t) => (
                <tr
                  key={t._id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{t.description}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {t.category || "-"}
                  </td>
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
                    {t.date
                      ? new Date(t.date).toLocaleDateString("vi-VN")
                      : "-"}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev < totalPages ? prev + 1 : prev
              )
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal Edit */}
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
