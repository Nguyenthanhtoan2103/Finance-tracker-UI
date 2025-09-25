import { io } from "socket.io-client";

const token = localStorage.getItem("token");

export const socket = io("http://www.ftracker.site:5000", {
  withCredentials: true,
  autoConnect: false,
  auth: {
    token: token ? `Bearer ${token}` : null,
  },
});

export const joinUserRoom = (userId) => {
  if (socket && userId) {
    socket.emit("join", userId);
  }
};
