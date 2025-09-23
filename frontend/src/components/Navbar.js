import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("");
    navigate("/login");
  };

  const links = [
    { path: "/", label: "Dashboard" },
    { path: "/reports", label: "Reports" },
    { path: "/budgets", label: "Budgets" },
  ];

  return (
    <nav className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <h1 className="text-xl font-bold tracking-wide hover:scale-105 transition-transform">
          Finance Tracker
        </h1>

        {/* Navigation Links */}
        <div className="flex space-x-4 items-center">
          {links.map((link) => (
            <Link
              key={link.path}
              to={username ? link.path : "#"} // disable khi chưa login
              onClick={(e) => {
                if (!username) e.preventDefault(); // chặn click
              }}
              className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                location.pathname === link.path
                  ? "bg-white text-blue-600 font-semibold shadow"
                  : "hover:bg-blue-500"
              } ${!username ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {link.label}
            </Link>
          ))}

          {/* Login / Logout */}
          {username ? (
            <>
              <span className="ml-4 font-medium italic text-sm text-yellow-300">
                Welcome, {username} 👋
              </span>
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-500 hover:bg-red-600 px-3 py-1 rounded font-semibold transition text-white text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
