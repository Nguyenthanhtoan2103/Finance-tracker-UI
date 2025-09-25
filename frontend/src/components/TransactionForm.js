// import React, { useState, useContext, useEffect } from "react";
// import { toast } from "react-toastify";
// import { AuthContext } from "../context/AuthContext";
// import { socket, joinUserRoom } from "../services/socket";
// import { createTransaction } from "../services/api";

// export default function TransactionForm({ onNewTransaction }) {
//   const { isLoggedIn } = useContext(AuthContext);

//   const [form, setForm] = useState({
//     description: "",
//     amount: "",
//     category: "",
//     type: "expense",
//     date: new Date().toISOString().slice(0, 10),
//     paymentMethod: "cash",
//   });

//   const [loading, setLoading] = useState(false);

//   // Join room và lắng nghe socket event
//   useEffect(() => {
//     if (isLoggedIn) {
//       const userId = localStorage.getItem("userId");
//       if (userId) {
//         socket.auth = { token: localStorage.getItem("token") };
//         socket.connect();
//         joinUserRoom(userId);

//         // Lắng nghe event transaction mới
//         socket.on("transaction:new", (transaction) => {
//           console.log("🔔 Transaction mới:", transaction);
//           if (onNewTransaction) {
//             onNewTransaction(transaction); // gửi lên component cha để update list
//           }
//         });
//       }

//       return () => {
//         socket.off("transaction:new");
//         socket.disconnect();
//       };
//     }
//   }, [isLoggedIn, onNewTransaction]);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isLoggedIn) {
//       toast.error("⚠️ Please log in to add a transaction!");
//       return;
//     }

//     try {
//       setLoading(true);

//       const transactionData = {
//         description: form.description,
//         amount: Number(form.amount),
//         category: form.category,
//         type: form.type,
//         date: form.date,
//         paymentMethod: form.paymentMethod,
//       };

//       const res = await createTransaction(transactionData);

//       toast.success("Transaction added successfully!");

//       // Không cần emit ở frontend nếu backend emit rồi
//       // socket.emit("transaction:new", res.data);

//       setForm({
//         description: "",
//         amount: "",
//         category: "",
//         type: "expense",
//         date: new Date().toISOString().slice(0, 10),
//         paymentMethod: "cash",
//       });
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add transaction!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-4 bg-white shadow rounded-lg flex flex-col gap-3"
//     >
//       <input
//         type="text"
//         name="description"
//         value={form.description}
//         onChange={handleChange}
//         placeholder="Description"
//         className="border p-2 rounded w-full"
//         required
//       />

//       <input
//         type="number"
//         name="amount"
//         value={form.amount}
//         onChange={handleChange}
//         placeholder="Amount"
//         required
//         min="0"
//         step="0.01"
//         className="border p-2 rounded w-full"
//       />

//       <input
//         type="text"
//         name="category"
//         value={form.category}
//         onChange={handleChange}
//         placeholder="Category"
//         className="border p-2 rounded w-full"
//         required
//       />

//       <select
//         name="type"
//         value={form.type}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       >
//         <option value="expense">Expense</option>
//         <option value="income">Income</option>
//       </select>

//       <input
//         type="date"
//         name="date"
//         value={form.date}
//         onChange={handleChange}
//         required
//         className="border p-2 rounded w-full"
//       />

//       <select
//         name="paymentMethod"
//         value={form.paymentMethod}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       >
//         <option value="cash">Cash</option>
//         <option value="credit">Credit Card</option>
//         <option value="bank">Bank Transfer</option>
//         <option value="ewallet">E-Wallet</option>
//       </select>

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
//       >
//         {loading ? "Saving..." : "Add Transaction"}
//       </button>
//     </form>
//   );
// }
// import React, { useState, useContext, useEffect } from "react";
// import { toast } from "react-toastify";
// import { AuthContext } from "../context/AuthContext";
// import { socket, joinUserRoom } from "../services/socket";
// import { createTransaction } from "../services/api";

// export default function TransactionForm({ onNewTransaction }) {
//   const { isLoggedIn } = useContext(AuthContext);

//   const [form, setForm] = useState({
//     description: "",
//     amount: "",
//     category: "",
//     type: "expense",
//     date: new Date().toISOString().slice(0, 10),
//     paymentMethod: "cash",
//   });

//   const [loading, setLoading] = useState(false);

//   // --- Join socket room & lắng nghe event
//   useEffect(() => {
//     if (isLoggedIn) {
//       joinUserRoom(); // gọi connect + join room

//       socket.on("transaction:update", (transaction) => {
//         console.log("🔔 Transaction mới:", transaction);
//         if (onNewTransaction) {
//           onNewTransaction(transaction); // gửi lên component cha để cập nhật danh sách
//         }
//       });
//     }

//     return () => {
//       socket.off("transaction:update");
//       socket.disconnect();
//     };
//   }, [isLoggedIn, onNewTransaction]);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isLoggedIn) {
//       toast.error("⚠️ Please log in to add a transaction!");
//       return;
//     }

//     try {
//       setLoading(true);

//       const transactionData = {
//         description: form.description,
//         amount: Number(form.amount),
//         category: form.category,
//         type: form.type,
//         date: form.date,
//         paymentMethod: form.paymentMethod,
//       };

//       const res = await createTransaction(transactionData);

//       toast.success("Transaction added successfully!");

//       setForm({
//         description: "",
//         amount: "",
//         category: "",
//         type: "expense",
//         date: new Date().toISOString().slice(0, 10),
//         paymentMethod: "cash",
//       });
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add transaction!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-4 bg-white shadow rounded-lg flex flex-col gap-3"
//     >
//       <input
//         type="text"
//         name="description"
//         value={form.description}
//         onChange={handleChange}
//         placeholder="Description"
//         className="border p-2 rounded w-full"
//         required
//       />

//       <input
//         type="number"
//         name="amount"
//         value={form.amount}
//         onChange={handleChange}
//         placeholder="Amount"
//         required
//         min="0"
//         step="0.01"
//         className="border p-2 rounded w-full"
//       />

//       <input
//         type="text"
//         name="category"
//         value={form.category}
//         onChange={handleChange}
//         placeholder="Category"
//         className="border p-2 rounded w-full"
//         required
//       />

//       <select
//         name="type"
//         value={form.type}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       >
//         <option value="expense">Expense</option>
//         <option value="income">Income</option>
//       </select>

//       <input
//         type="date"
//         name="date"
//         value={form.date}
//         onChange={handleChange}
//         required
//         className="border p-2 rounded w-full"
//       />

//       <select
//         name="paymentMethod"
//         value={form.paymentMethod}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       >
//         <option value="cash">Cash</option>
//         <option value="credit">Credit Card</option>
//         <option value="bank">Bank Transfer</option>
//         <option value="ewallet">E-Wallet</option>
//       </select>

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
//       >
//         {loading ? "Saving..." : "Add Transaction"}
//       </button>
//     </form>
//   );
// }
import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { socket, joinUserRoom } from "../services/socket";
import { createTransaction } from "../services/api";

export default function TransactionForm({ onNewTransaction }) {
  const { isLoggedIn } = useContext(AuthContext);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: "cash",
  });

  const [loading, setLoading] = useState(false);

  // --- Connect Socket.IO và join room ---
  useEffect(() => {
    if (isLoggedIn) {
      joinUserRoom(); // đảm bảo userId đã tồn tại trong localStorage

      socket.on("transaction:update", (transaction) => {
        console.log("🔔 Transaction mới:", transaction);
        if (onNewTransaction) onNewTransaction(transaction);
      });
    }

    return () => {
      socket.off("transaction:update");
      socket.disconnect();
    };
  }, [isLoggedIn, onNewTransaction]);

  // --- Handle form change ---
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // --- Handle submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("⚠️ Please log in to add a transaction!");
      return;
    }

    try {
      setLoading(true);

      const transactionData = {
        description: form.description,
        amount: Number(form.amount),
        category: form.category,
        type: form.type,
        date: form.date,
        paymentMethod: form.paymentMethod,
      };

      const res = await createTransaction(transactionData);

      toast.success("Transaction added successfully!");

      // Không cần emit ở frontend nếu backend đã emit
      // socket.emit("transaction:new", res.data);

      setForm({
        description: "",
        amount: "",
        category: "",
        type: "expense",
        date: new Date().toISOString().slice(0, 10),
        paymentMethod: "cash",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add transaction!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow rounded-lg flex flex-col gap-3"
    >
      <input
        type="text"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 rounded w-full"
        required
      />

      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
        min="0"
        step="0.01"
        className="border p-2 rounded w-full"
      />

      <input
        type="text"
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        className="border p-2 rounded w-full"
        required
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      />

      <select
        name="paymentMethod"
        value={form.paymentMethod}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="cash">Cash</option>
        <option value="credit">Credit Card</option>
        <option value="bank">Bank Transfer</option>
        <option value="ewallet">E-Wallet</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Transaction"}
      </button>
    </form>
  );
}
