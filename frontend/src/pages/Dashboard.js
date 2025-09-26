import React, { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import ChartSummary from "../components/ChartSumary";
import Top5Transactions from "../components/Top5Transactions";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../services/api";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  const load = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (tx) => {
    try {
      await createTransaction(tx);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow-sm">
            💰 Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Track your income and expenses effectively
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side: Form + Top 5 */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                Add Transaction
              </h2>
              <TransactionForm onAdd={handleAdd} />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                Top 5 Transactions
              </h2>
              <Top5Transactions transactions={transactions} />
            </div>
          </div>

          {/* Right side: Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              📊 Summary
            </h2>
            <ChartSummary transactions={transactions} />
          </div>
        </div>

        {/* Full-width Transactions List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            All Transactions
          </h2>
          <TransactionList
            transactions={transactions}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
