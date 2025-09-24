import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // icon con mắt

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false); // trạng thái hiển thị password

  const navigate = useNavigate();

  const validateEmail = (email) => {
    console.log("Validating email:", email);
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    console.log("Validating password:", password);
    return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);

    if (!validateEmail(form.email)) {
      console.log("Invalid email format:", form.email);
      toast.error("Invalid email format.");
      return;
    }

    if (!validatePassword(form.password)) {
      console.log("Invalid password:", form.password);
      toast.error(
        "Password must be at least 6 characters and include letters & numbers."
      );
      return;
    }

    try {
      console.log("Calling registerUser API with data:", form);
      const response = await registerUser(form);
      console.log("API response:", response.data);

      toast.success("Register successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Register failed:", err);
      toast.error(
        "Register failed. " +
          (err.response?.data?.message || err.message || "Unknown error")
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Create Account ✨
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.username}
            onChange={(e) => {
              console.log("Username changed:", e.target.value);
              setForm({ ...form, username: e.target.value });
            }}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => {
              console.log("Email changed:", e.target.value);
              setForm({ ...form, email: e.target.value });
            }}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => {
                console.log("Password changed:", e.target.value);
                setForm({ ...form, password: e.target.value });
              }}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-500 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
