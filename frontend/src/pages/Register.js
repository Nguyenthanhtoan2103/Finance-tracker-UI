import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Regex check email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    // ít nhất 6 ký tự, có 1 chữ và 1 số
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      toast.error("Invalid email format.");
      return;
    }

    if (!validatePassword(form.password)) {
      toast.error(
        "Password must be at least 6 characters and include letters & numbers."
      );
      return;
    }

    try {
      await registerUser(form);
      toast.success("Register successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error("Register failed. " + err.response?.data?.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Create Account ✨
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold transition"
          >
            Register
          </button>
        </form>

        {/* Extra */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
