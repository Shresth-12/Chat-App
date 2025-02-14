import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();
let socketInstance = null;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const connectSocket = () => {
    const userId = localStorage.getItem("userid");
    if (!userId || (socketInstance && socketInstance.connected)) return;

    socketInstance = io("https://chat-app-backend-tlqu.onrender.com", {
      query: {
         userId:userId 
        },
      transports: ["websocket", "polling"], // Allow fallback to polling
      reconnection: true, // Enable automatic reconnection
      reconnectionAttempts: 5, // Number of retry attempts
      reconnectionDelay: 3000, // Wait before retrying
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket Connected:", socketInstance.id);
      localStorage.setItem("socketId", socketInstance.id); // Store new socket ID
      setSocket(socketInstance);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket Disconnected:", reason);
      localStorage.removeItem("socketId"); // Remove stored socket ID
      setSocket(null);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("⚠️ WebSocket Connection Error:", error);
    });

    socketInstance.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  const disconnectSocket = () => {
    if (socketInstance) {
      socketInstance.disconnect();
      console.log("🔌 Socket Disconnected Manually");
      localStorage.removeItem("socketId");
      socketInstance = null;
      setSocket(null);
    }
  };

  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket(); // Ensure socket is disconnected on unmount
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
