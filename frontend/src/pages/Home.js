import { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Dashboard from "../components/Dashboard";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await getTransactions(token);
    setTransactions(res.data);
  };

  const addTransaction = async (t) => {
    await createTransaction(t, token);
    fetchTransactions();
  };

  const removeTransaction = async (id) => {
    await deleteTransaction(id, token);
    fetchTransactions();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        💰 Finance Tracker
      </h1>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form + List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
            <TransactionForm addTransaction={addTransaction} />
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Transactions</h2>
            <TransactionList
              transactions={transactions}
              deleteTransaction={removeTransaction}
            />
          </div>
        </div>

        {/* Right: Dashboard */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow h-full">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <Dashboard transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
