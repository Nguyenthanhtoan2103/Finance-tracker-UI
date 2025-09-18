import React from "react";
import { Trash2 } from "lucide-react"; // icon delete

export default function TransactionList({ transactions = [], onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4">Transactions</h3>

      {transactions.length === 0 ? (
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
              {transactions.map((t) => (
                <tr
                  key={t._id || t.id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{t.description}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {t.category || "-"}
                  </td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      t.type === "income"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {t.type}
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    {t.amount.toLocaleString()} ₫
                  </td>
                  <td className="px-4 py-2 text-center">
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
    </div>
  );
}
