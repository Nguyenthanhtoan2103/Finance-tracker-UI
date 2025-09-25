// import { io } from "socket.io-client";

// const token = localStorage.getItem("token");
// const userId = localStorage.getItem("userId"); // Lấy userId lưu ở localStorage

// export const socket = io("http://www.ftracker.site:5000", {
//   withCredentials: true,
//   autoConnect: true, // tự động connect khi import
//   auth: {token},
//   query: {userId}
// });

// // Nếu muốn vẫn giữ joinUserRoom thủ công
// export const joinUserRoom = (userId) => {
//   if (socket && userId) {
//     socket.emit("join", userId);
//   }
// };
import { io } from "socket.io-client";

export const socket = io("http://www.ftracker.site:5000", {
  withCredentials: true,
  autoConnect: false,
});

export const joinUserRoom = (userId) => {
  if (socket && userId) {
    socket.emit("join", userId);
  }
};
