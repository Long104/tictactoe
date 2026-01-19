"use client";
import { socket } from "@/socket";
import { useEffect, createContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

interface SocketContextType {
  isConnected: boolean;
  socket: typeof socket;
}

export const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  socket,
});

const SocketProvider = ({ children }: Props) => {
  const [isConnected, setIsConnected] = useState(socket.connected || false);
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log("Socket connected in context");
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("Socket disconnected");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, socket }}>
      {children}
    </SocketContext.Provider>
  );
};
export default SocketProvider;
