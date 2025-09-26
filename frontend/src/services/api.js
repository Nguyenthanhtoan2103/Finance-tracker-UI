import axios from "axios";

const API = axios.create({
  baseURL: "http://www.ftracker.site:5000/api", 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Transactions
// export const getTransactions = () => API.get("/transactions");
export const getTransactions = (page = 1, limit = 10, search = "") =>
  API.get(`/transactions?page=${page}&limit=${limit}&search=${search}`);

export const getTop5Transactions = () => API.get("/transactions/top5");
export const createTransaction = (data) => API.post("/transactions", data);
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

// Reports
export const getReports = () => API.get("/reports");
export const getReportSummary = () => API.get("/reports/summary");
export const downloadReportPDF = () =>
  API.get("/reports/pdf", { responseType: "blob" });
export const downloadReportExcel = () =>
  API.get("/reports/excel", { responseType: "blob" });

// Budgets
export const getBudgets = () => API.get("/budgets");
export const setBudget = (data) => API.post("/budgets", data);
export const updateBudget = (id, data) => API.put(`/budgets/${id}`, data);
export const deleteBudget = (id) => API.delete(`/budgets/${id}`);