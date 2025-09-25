import { io } from "socket.io-client";

// Lấy token và userId từ localStorage
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

export const socket = io("http://www.ftracker.site:5000", {
  withCredentials: true,
  autoConnect: false, // sẽ connect thủ công khi cần
  auth: {
    token: token ? `Bearer ${token}` : null,
  },
  query: {
    userId: userId || "", // gửi userId lên server
  },
});

// Kết nối socket và join room userId
export const joinUserRoom = () => {
  const storedUserId = localStorage.getItem("userId");
  if (socket && storedUserId) {
    socket.connect(); // kết nối socket
    socket.emit("join", storedUserId); // emit join room
    console.log("🔹 Joining room:", storedUserId);
  } else {
    console.warn("⚠️ No userId found in localStorage");
  }
};
