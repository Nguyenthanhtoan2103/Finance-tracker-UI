import React, { useState, useEffect, useCallback } from "react";
import { loginUser } from "../services/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // ✅ Import icon

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // ✅ Trạng thái show/hide mật khẩu
  const apiUrl = process.env.REACT_APP_API_URL;

  const location = useLocation();
  const navigate = useNavigate();

  const handleLoginSuccess = (token, username, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId); 
    localStorage.setItem("isLoggedIn", "true");
    toast.success("Login successful!");
    window.location.href = "/";
  };

  const checkGoogleRedirect = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const username = params.get("username");

    if (token) {
      handleLoginSuccess(token, username || "GoogleUser");
    }
  }, [location.search]);

  useEffect(() => {
    checkGoogleRedirect();
  }, [checkGoogleRedirect]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

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
      console.error(err);
      toast.error("Login failed. Check email/password.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Welcome Back 👋
        </h2>

        {/* Form login */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold transition"
          >
            Login
          </button>
        </form>

        {/* Google Login */}
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

        {/* Link to Register */}
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
