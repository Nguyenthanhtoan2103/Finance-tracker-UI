import React from "react";
import BudgetManager from "../components/BudgetManagement";

export default function BudgetPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Budget Manager
        </h1>
        <BudgetManager />
      </div>
    </div>
  );
}
