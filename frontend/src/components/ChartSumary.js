import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function ChartSummary({ transactions = [] }) {
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

  const COLORS = ["#10B981", "#EF4444"]; // xanh lá, đỏ

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 Summary</h3>

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

      <div className="flex justify-between items-center mt-6 text-sm">
        <div className="text-center">
          <div className="text-gray-500">Income</div>
          <div className="font-bold text-green-600">${income}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">Expense</div>
          <div className="font-bold text-red-500">${expense}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">Balance</div>
          <div
            className={`font-bold ${
              income - expense >= 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            ${income - expense}
          </div>
        </div>
      </div>
    </div>
  );
}
