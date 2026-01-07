"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [textValue, setTextValue] = useState("");
  const [textValue2, setTextValue2] = useState("");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });

      // Request the current text value when connecting
      socket.emit("get-text");
      socket.emit("get-text2");
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    // Listen for text updates from other clients
    function onTextUpdate(newText: string) {
      setTextValue(newText);
    }

    // Listen for text updates from other clients 2
    function onTextUpdate2(newText: string) {
      setTextValue2(newText);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("text-update", onTextUpdate);
    socket.on("text-update2", onTextUpdate2);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("text-update", onTextUpdate);
      socket.off("text-update2", onTextUpdate2);
    };
  }, []);

  // Handle textarea changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextValue(newValue);
    // Send the change to the server
    socket.emit("text-change", newValue);
  };

  // Handle textarea changes2
  const handleTextChange2 = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextValue2(newValue);
    // Send the change to the server
    socket.emit("text-change2", newValue);
  };

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>
        <textarea value={textValue} onChange={handleTextChange} />
        <textarea value={textValue2} onChange={handleTextChange2} />
      </p>
      <p>Transport: {transport}</p>
    </div>
  );
}
