import React, { useState, useEffect } from "react";
import { loginUser } from "../services/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const apiUrl = process.env.REACT_APP_API_URL;

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Helper chung cho cả login thường & Google
  const handleLoginSuccess = (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    toast.success("Login successful!");
    navigate("/"); // quay về trang Home
  };

  // ✅ Kiểm tra nếu Google redirect về với token
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const username = params.get("username");

    if (token) {
      handleLoginSuccess(token, username || "GoogleUser");
    }
  }, [location]);

  // Validate email
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validate password >= 6 ký tự
  const validatePassword = (password) => password.length >= 6;

  // Submit login thường (email + password)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      toast.error("Invalid email format.");
      return;
    }
    if (!validatePassword(form.password)) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await loginUser(form);
      handleLoginSuccess(res.data.token, res.data.username);
    } catch (err) {
      toast.error("Login failed. Check email/password.");
    }
  };

  // Login với Google OAuth2
  const handleGoogleLogin = () => {
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Welcome Back 👋
        </h2>

        {/* Form login thường */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold transition"
          >
            Login
          </button>
        </form>

        {/* Nút login Google */}
        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100 transition"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Login with Google</span>
        </button>

        {/* Link sang Register */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
