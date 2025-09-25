import { io } from "socket.io-client";

export const socket = io("http://www.ftracker.site:5000", {
  withCredentials: true,
  autoConnect: false, // connect thủ công
});

export const joinUserRoom = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.warn("⚠️ No userId found in localStorage");
    return;
  }

  console.log("Connecting to Socket.IO with userId:", userId);

  socket.auth = { token: token ? `Bearer ${token}` : null };
  socket.connect();

  socket.emit("join", userId);
};
