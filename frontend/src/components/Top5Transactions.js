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
import React, { useEffect, useState } from "react";
import { socket } from "../services/socket"; // socket kết nối kèm userId
import { getTransactions } from "../services/api"; // API lấy toàn bộ transactions

export default function Top5Transactions() {
  const [transactions, setTransactions] = useState([]);

  // Lấy dữ liệu lần đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTransactions();
        setTransactions(res.data || []);
      } catch (err) {
        console.error("❌ Lỗi load transactions:", err);
      }
    };
    fetchData();
  }, []);

  // Lắng nghe socket realtime
  useEffect(() => {
    socket.on("transaction:update", (payload) => {
      console.log("📩 Top5Transactions nhận realtime:", payload);

      if (payload.action === "created") {
        setTransactions((prev) => [payload.data, ...prev]);
      }
      if (payload.action === "updated") {
        setTransactions((prev) =>
          prev.map((t) => (t._id === payload.data._id ? payload.data : t))
        );
      }
      if (payload.action === "deleted") {
        setTransactions((prev) =>
          prev.filter((t) => t._id !== payload.data._id)
        );
      }
    });

    return () => {
      socket.off("transaction:update");
    };
  }, []);

  // Lọc top 5 theo amount giảm dần
  const top5 = [...transactions]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="bg-white p-5 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">🔥 Top 5 Transactions</h2>
      <ul className="divide-y divide-gray-200">
        {top5.map((tx) => (
          <li key={tx._id} className="py-2 flex justify-between">
            <span>{tx.note}</span>
            <span
              className={
                tx.type === "income" ? "text-green-600" : "text-red-600"
              }
            >
              {tx.amount}$
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
