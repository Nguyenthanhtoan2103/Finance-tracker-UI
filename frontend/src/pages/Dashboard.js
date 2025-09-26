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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side: Form + Top5 + List */}
          <div className="space-y-6">
            {/* Transaction Form */}
            <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
              <TransactionForm onAdd={handleAdd} />
            </div>

            {/* Top 5 Transactions */}

            {/* Transaction List */}
            
          </div>

          {/* Right side: Chart */}
          <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow">
            <Top5Transactions transactions={transactions} />
            <ChartSummary transactions={transactions} />
            
          </div>
        </div>
      </div>
      <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Transactions</h2>
              <TransactionList
                transactions={transactions}
                onDelete={handleDelete}
              />
            </div>
    </div>
  );
}
