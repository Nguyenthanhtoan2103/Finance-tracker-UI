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
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Trash2, Edit3 } from "lucide-react";
import { toast } from "react-toastify";
import EditTransactionModal from "./EditTransactionModal";
import { updateTransaction, deleteTransaction } from "../services/api";
import { socket } from "../services/socket";

export default function TransactionList({ transactions = [], onRefresh }) {
  const [localTransactions, setLocalTransactions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Paging
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Keep a ref so handlers can be cleaned up reliably
  const socketHandlersRef = useRef({});

  // Initialize local state from props (initial load or full refresh)
  useEffect(() => {
    setLocalTransactions(Array.isArray(transactions) ? transactions : []);
    // keep page 1 when props change (optional)
    setCurrentPage(1);
  }, [transactions]);

  // Utility: safe date -> time (fallback 0)
  const getTime = (d) => {
    const t = new Date(d).getTime();
    return Number.isFinite(t) ? t : 0;
  };

  // SOCKET: robust listener for multiple possible event names
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.warn("TransactionList: no userId in localStorage — socket listener not attached.");
      return;
    }

    // possible event names server might emit; we attach to all and normalize
    const events = [
      `transaction:${userId}`,
      "transaction",
      "transaction:created",
      "transaction:updated",
      "transaction:deleted",
    ];

    const handleEvent = (evtName, payload) => {
      console.debug("Socket event", evtName, payload);
      // normalize message shape
      let action = null;
      if (evtName.includes("created")) action = "created";
      else if (evtName.includes("updated")) action = "updated";
      else if (evtName.includes("deleted")) action = "deleted";
      else if (payload && payload.action) action = payload.action;

      const data = payload && payload.data ? payload.data : payload;

      // if payload contains userId and it's not for this user, ignore
      if (payload && payload.userId && payload.userId !== userId) return;

      if (!data || !data._id) {
        // sometimes server sends { action, data }, sometimes raw data — if neither contains _id, ignore
        return;
      }

      setLocalTransactions((prev) => {
        if (action === "created") {
          // avoid duplicates
          if (prev.some((p) => p._id === data._id)) return prev;
          return [data, ...prev];
        }
        if (action === "updated") {
          return prev.map((t) => (t._id === data._id ? data : t));
        }
        if (action === "deleted") {
          return prev.filter((t) => t._id !== data._id);
        }
        // fallback: if unknown, try to merge by id (update) or append
        if (prev.some((p) => p._id === data._id)) {
          return prev.map((t) => (t._id === data._id ? data : t));
        }
        return [data, ...prev];
      });
    };

    // register handlers and keep references for cleanup
    events.forEach((ev) => {
      const h = (payload) => handleEvent(ev, payload);
      socket.on(ev, h);
      socketHandlersRef.current[ev] = h;
    });

    // optional: notify server we want updates for this user (harmless if server ignores)
    try {
      socket.emit("join", { userId });
    } catch (err) {
      // ignore if server doesn't support 'join'
    }

    return () => {
      // cleanup exactly the handlers we registered
      events.forEach((ev) => {
        const h = socketHandlersRef.current[ev];
        if (h) socket.off(ev, h);
      });
      socketHandlersRef.current = {};
    };
  }, []); // run once

  // Filter + sort (desc by date)
  const filteredTransactions = useMemo(() => {
    const term = (searchTerm || "").trim().toLowerCase();
    const filtered = localTransactions.filter((t) => {
      if (!term) return true;
      return (
        (t.description && t.description.toLowerCase().includes(term)) ||
        (t.category && t.category.toLowerCase().includes(term)) ||
        (t.payment && t.payment.toLowerCase().includes(term))
      );
    });

    filtered.sort((a, b) => getTime(b.date) - getTime(a.date));
    return filtered;
  }, [localTransactions, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));

  // Clamp currentPage when totalPages shrinks/expands
  useEffect(() => {
    setCurrentPage((prev) => {
      if (!prev || prev < 1) return 1;
      return Math.min(prev, totalPages);
    });
  }, [totalPages]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  // Reset page only when search term explicitly changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Update transaction
  const handleUpdate = async (data) => {
    if (!editing) return;
    setLoading(true);
    try {
      const updated = await updateTransaction(editing._id, data);

      // update local state immediately
      setLocalTransactions((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));

      // emit to server so other clients get update
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          socket.emit("transaction:updated", { userId, data: updated });
        } catch (err) {
          console.warn("Socket emit failed:", err);
        }
      }

      toast.success("Transaction updated successfully!");
      setEditing(null);
      if (typeof onRefresh === "function") onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  // Delete transaction
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

                  // update local immediately
                  setLocalTransactions((prev) => prev.filter((p) => p._id !== t._id));

                  const userId = localStorage.getItem("userId");
                  if (userId) {
                    try {
                      socket.emit("transaction:deleted", { userId, data: t });
                    } catch (err) {
                      console.warn("Socket emit failed:", err);
                    }
                  }

                  toast.success("Deleted successfully!");
                  if (typeof onRefresh === "function") onRefresh();
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
            <button onClick={closeToast} className="bg-gray-300 px-3 py-1 rounded">
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <input
        type="text"
        placeholder="Search by description, category, or payment..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

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
                <tr key={t._id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-4 py-2">{t.description}</td>
                  <td className="px-4 py-2 text-gray-600">{t.category || "-"}</td>
                  <td className={`px-4 py-2 font-medium ${t.type === "income" ? "text-green-600" : "text-red-500"}`}>
                    {t.type}
                  </td>
                  <td className="px-4 py-2 font-semibold">{t.amount?.toLocaleString("vi-VN")} ₫</td>
                  <td className="px-4 py-2">{t.payment || "-"}</td>
                  <td className="px-4 py-2">{t.date ? new Date(t.date).toLocaleDateString("vi-VN") : "-"}</td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    <button onClick={() => setEditing(t)} className="text-blue-500 hover:text-blue-700 transition">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDelete(t)} className="text-red-500 hover:text-red-700 transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {editing && <EditTransactionModal transaction={editing} onClose={() => setEditing(null)} onSubmit={handleUpdate} loading={loading} />}
    </div>
  );
}
