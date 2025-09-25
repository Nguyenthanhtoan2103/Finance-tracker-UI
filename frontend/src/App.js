import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Budget from "./pages/Budgets";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext"; // <-- import AuthProvider

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // vẫn dùng localStorage

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budgets"
            element={
              <ProtectedRoute>
                <Budget />
              </ProtectedRoute>
            }
          />

          {/* Redirect all other paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
}
