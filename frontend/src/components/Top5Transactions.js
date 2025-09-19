import React from "react";

export default function Top5Transactions({ transactions }) {
  const top5 = [...transactions]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="bg-white p-5 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Top 5 Transactions</h2>
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
