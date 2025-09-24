import React, { createContext, useContext, useEffect } from "react";
import { socket, joinUserRoom } from "../services/socket";
import { useAuth } from "./AuthContext"; // giả sử bạn có AuthContext chứa userId

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;

    socket.connect();
    joinUserRoom(userId);

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO");
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
