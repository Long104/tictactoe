"use client";
import { socket } from "@/socket";
import { useEffect, createContext, useState } from "react";

interface props {
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

const SocketProvider = ({ children }: props) => {
  const [isConnected, setIsConnected] = useState(socket.connected || false);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
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
    <div>
      <SocketContext.Provider value={{ isConnected, socket }}>
        {children}
      </SocketContext.Provider>
    </div>
  );
};

export default SocketProvider;
