// frontend/src/services/socket.js
import { io } from "socket.io-client";

const BASE = process.env.REACT_APP_SOCKET_URL || "http://www.ftracker.site:5000";

// tạo socket nhưng **không** connect ngay
export const socket = io(BASE, {
  autoConnect: false,
  withCredentials: true,
});

// gọi trước khi connect: thiết lập auth + query rồi connect
export function connectSocket({ userId, token }) {
  if (!userId) {
    console.warn("[socket] connectSocket(): no userId provided");
    return;
  }

  // set token trong auth (server có thể dùng để verify nếu cần)
  socket.auth = { token: token ? `Bearer ${token}` : null };

  // set query (một số version dùng socket.io.opts.query)
  socket.io.opts.query = { userId };

  console.log("[socket] connectSocket() -> userId:", userId, " tokenExists:", !!token);

  if (!socket.connected) {
    socket.connect();
  }
}

// gọi khi logout hoặc muốn disconnect
export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}

// helper: join room explicitly (server should listen "join")
export function joinUserRoom(userId) {
  if (!socket.connected) {
    console.warn("[socket] joinRoom(): socket not connected yet");
    return;
  }
  if (!userId) {
    console.warn("[socket] joinRoom(): no userId");
    return;
  }
  socket.emit("join", userId);
  console.log("[socket] emit join ->", userId);
}
