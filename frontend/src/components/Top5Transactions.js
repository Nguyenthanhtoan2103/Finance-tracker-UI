// import React from "react";

// export default function Top5Transactions({ transactions }) {
//   const top5 = [...transactions]
//     .sort((a, b) => b.amount - a.amount)
//     .slice(0, 5);

//   return (
//     <div className="bg-white p-5 rounded-lg shadow mb-6">
//       <h2 className="text-xl font-semibold mb-4">Top 5 Transactions</h2>
//       <ul className="divide-y divide-gray-200">
//         {top5.map((tx) => (
//           <li key={tx._id} className="py-2 flex justify-between">
//             <span>{tx.note}</span>
//             <span
//               className={
//                 tx.type === "income" ? "text-green-600" : "text-red-600"
//               }
//             >
//               {tx.amount}$
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import { socket } from "../services/socket"; // socket kết nối kèm userId
// import { getTransactions } from "../services/api"; // API lấy toàn bộ transactions

// export default function Top5Transactions() {
//   const [transactions, setTransactions] = useState([]);

//   // Lấy dữ liệu lần đầu
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await getTransactions();
//         setTransactions(res.data || []);
//       } catch (err) {
//         console.error("❌ Lỗi load transactions:", err);
//       }
//     };
//     fetchData();
//   }, []);

//   // Lắng nghe socket realtime
//   useEffect(() => {
//     socket.on("transaction:update", (payload) => {
//       console.log("📩 Top5Transactions nhận realtime:", payload);

//       if (payload.action === "created") {
//         setTransactions((prev) => [payload.data, ...prev]);
//       }
//       if (payload.action === "updated") {
//         setTransactions((prev) =>
//           prev.map((t) => (t._id === payload.data._id ? payload.data : t))
//         );
//       }
//       if (payload.action === "deleted") {
//         setTransactions((prev) =>
//           prev.filter((t) => t._id !== payload.data._id)
//         );
//       }
//     });

//     return () => {
//       socket.off("transaction:update");
//     };
//   }, []);

//   // Lọc top 5 theo amount giảm dần
//   const top5 = [...transactions]
//     .sort((a, b) => b.amount - a.amount)
//     .slice(0, 5);

//   return (
//     <div className="bg-white p-5 rounded-lg shadow mb-6">
//       <h2 className="text-xl font-semibold mb-4">🔥 Top 5 Transactions</h2>
//       <ul className="divide-y divide-gray-200">
//         {top5.map((tx) => (
//           <li key={tx._id} className="py-2 flex justify-between">
//             <span>{tx.note}</span>
//             <span
//               className={
//                 tx.type === "income" ? "text-green-600" : "text-red-600"
//               }
//             >
//               {tx.amount}$
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { socket } from "../services/socket";
import { getTop5Transactions } from "../services/api";

export default function Top5Transactions() {
  const [transactions, setTransactions] = useState([]);

  // Lấy top 5 transactions ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTop5Transactions();
        setTransactions(data.data || []);
      } catch (err) {
        console.error("❌ Lỗi load top 5 transactions:", err);
      }
    };
    fetchData();
  }, []);

  // Lắng nghe socket realtime
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const handler = (payload) => {
      console.log("📩 Top5Transactions nhận realtime:", payload);

      setTransactions((prev) => {
        let updated = [...prev];

        if (payload.action === "created") {
          updated = [payload.data, ...updated];
        }
        if (payload.action === "updated") {
          updated = updated.map((t) =>
            t._id === payload.data._id ? payload.data : t
          );
        }
        if (payload.action === "deleted") {
          updated = updated.filter((t) => t._id !== payload.data._id);
        }

        // Sắp xếp lại amount giảm dần và lấy top 5
        return updated.sort((a, b) => b.amount - a.amount).slice(0, 5);
      });
    };

    socket.on(`transaction:${userId}`, handler);

    return () => {
      socket.off(`transaction:${userId}`, handler);
    };
  }, []);

  return (
    <div className="bg-white p-5 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">🔥 Top 5 Transactions</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions available</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {transactions.map((tx) => (
            <li key={tx._id} className="py-2 flex justify-between">
              <span>{tx.description || "-"}</span>
              <span
                className={
                  tx.type === "income" ? "text-green-600" : "text-red-600"
                }
              >
                {tx.amount?.toLocaleString("vi-VN")}₫
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
