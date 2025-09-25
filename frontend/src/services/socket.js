import { io } from "socket.io-client";

export const socket = io("http://www.ftracker.site:5000", {
  withCredentials: true,
  autoConnect: false,
});

export const joinUserRoom = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.warn("⚠️ No userId found in localStorage");
    return;
  }

  socket.auth = { token: token ? `Bearer ${token}` : null };
  socket.io.opts.query = { userId };

  socket.connect();
  console.log("🔹 Connecting to Socket.IO with userId:", userId);
};
