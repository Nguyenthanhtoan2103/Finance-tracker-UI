import { io } from "socket.io-client";

// Kết nối tới backend
export const socket = io("http://www.ftracker.site:5000", {
  withCredentials: true,
  autoConnect: false, // chỉ connect khi có token
});

// Hàm login vào room userId
export const joinUserRoom = (userId) => {
  if (socket && userId) {
    socket.emit("join", userId);
  }
};
