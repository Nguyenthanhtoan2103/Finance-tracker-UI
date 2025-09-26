// import React, { useState, useEffect } from "react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// import { socket } from "../services/socket";

// export default function ChartSummary({ transactions: initialTransactions = [] }) {
//   const [transactions, setTransactions] = useState(initialTransactions);

//   // đồng bộ khi props initialTransactions thay đổi (ví dụ sau khi fetch API)
//   useEffect(() => {
//     setTransactions(initialTransactions);
//   }, [initialTransactions]);

//   // lắng nghe socket event
//   useEffect(() => {
//     const handleNewTransaction = ({ transaction }) => {
//       console.log("📩 ChartSummary nhận transaction:", transaction);
//       setTransactions((prev) => [...prev, transaction]);
//     };

//     socket.on("transaction:new", handleNewTransaction);

//     return () => {
//       socket.off("transaction:new", handleNewTransaction);
//     };
//   }, []);

//   // tính toán summary
//   const income = transactions
//     .filter((t) => t.type === "income")
//     .reduce((a, b) => a + b.amount, 0);

//   const expense = transactions
//     .filter((t) => t.type === "expense")
//     .reduce((a, b) => a + b.amount, 0);

//   const data = [
//     { name: "Income", value: income },
//     { name: "Expense", value: expense },
//   ];

//   const COLORS = ["#10B981", "#EF4444"];

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 Summary</h3>

//       <div className="w-full h-64">
//         <ResponsiveContainer>
//           <PieChart>
//             <Pie
//               data={data}
//               dataKey="value"
//               nameKey="name"
//               innerRadius={60}
//               outerRadius={90}
//               label
//             >
//               {data.map((entry, i) => (
//                 <Cell key={i} fill={COLORS[i % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="flex justify-between items-center mt-6 text-sm">
//         <div className="text-center">
//           <div className="text-gray-500">Income</div>
//           <div className="font-bold text-green-600">${income}</div>
//         </div>
//         <div className="text-center">
//           <div className="text-gray-500">Expense</div>
//           <div className="font-bold text-red-500">${expense}</div>
//         </div>
//         <div className="text-center">
//           <div className="text-gray-500">Balance</div>
//           <div
//             className={`font-bold ${
//               income - expense >= 0 ? "text-green-600" : "text-red-500"
//             }`}
//           >
//             ${income - expense}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// import { socket } from "../services/socket"; // socket đã connect kèm userId
// import { getTransactions } from "../services/api"; // API lấy transactions ban đầu

// export default function ChartSummary() {
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
//       console.log("📩 ChartSummary nhận realtime:", payload);

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

//   // --- Tính toán số liệu ---
//   const income = transactions
//     .filter((t) => t.type === "income")
//     .reduce((a, b) => a + b.amount, 0);

//   const expense = transactions
//     .filter((t) => t.type === "expense")
//     .reduce((a, b) => a + b.amount, 0);

//   const data = [
//     { name: "Income", value: income },
//     { name: "Expense", value: expense },
//   ];

//   const COLORS = ["#10B981", "#EF4444"];

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 Summary</h3>

//       <div className="w-full h-64">
//         <ResponsiveContainer>
//           <PieChart>
//             <Pie
//               data={data}
//               dataKey="value"
//               nameKey="name"
//               innerRadius={60}
//               outerRadius={90}
//               label
//             >
//               {data.map((entry, i) => (
//                 <Cell key={i} fill={COLORS[i % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="flex justify-between items-center mt-6 text-sm">
//         <div className="text-center">
//           <div className="text-gray-500">Income</div>
//           <div className="font-bold text-green-600">${income}</div>
//         </div>
//         <div className="text-center">
//           <div className="text-gray-500">Expense</div>
//           <div className="font-bold text-red-500">${expense}</div>
//         </div>
//         <div className="text-center">
//           <div className="text-gray-500">Balance</div>
//           <div
//             className={`font-bold ${
//               income - expense >= 0 ? "text-green-600" : "text-red-500"
//             }`}
//           >
//             ${income - expense}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { socket } from "../services/socket";
import { getTransactions } from "../services/api";

export default function ChartSummary() {
  const [transactions, setTransactions] = useState([]);

  // Lấy dữ liệu lần đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTransactions();
        // Nếu BE trả object {transactions: []} thì đổi lại thành res.data.transactions
        setTransactions(res.data.transactions || res.data || []);
      } catch (err) {
        console.error("❌ Lỗi load transactions:", err);
      }
    };
    fetchData();
  }, []);

  // Lắng nghe socket realtime
  useEffect(() => {
    socket.on("transaction:update", (payload) => {
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

  // --- Tính toán số liệu tổng ---
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const data = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const COLORS = ["#10B981", "#EF4444"];

  // --- Dữ liệu cho LineChart ---
  // Gom nhóm theo ngày (yyyy-mm-dd)
  const grouped = {};
  transactions.forEach((t) => {
    const date = new Date(t.date).toLocaleDateString("vi-VN");
    if (!grouped[date]) grouped[date] = { date, income: 0, expense: 0 };
    if (t.type === "income") grouped[date].income += t.amount;
    if (t.type === "expense") grouped[date].expense += t.amount;
  });
  const lineData = Object.values(grouped).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 Summary</h3>

      {/* Pie Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              label
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Thông tin Income / Expense / Balance */}
      <div className="flex justify-between items-center mt-6 text-sm">
        <div className="text-center">
          <div className="text-gray-500">Income</div>
          <div className="font-bold text-green-600">
            {income.toLocaleString()} ₫
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">Expense</div>
          <div className="font-bold text-red-500">
            {expense.toLocaleString()} ₫
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">Balance</div>
          <div
            className={`font-bold ${
              income - expense >= 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {(income - expense).toLocaleString()} ₫
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="w-full h-80 mt-10">
        <ResponsiveContainer>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10B981" />
            <Line type="monotone" dataKey="expense" stroke="#EF4444" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
