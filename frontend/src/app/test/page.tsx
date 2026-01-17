"use client";

import React, { useState, useEffect } from "react";
import { socket } from "../../socket";
import { useSocket } from "@/hook/useSocket";
import { Events } from "../../components/Events";
import { MyForm } from "../../components/MyForm";

export default function App() {
  const [fooEvents, setFooEvents] = useState([""]);
  const { isConnected, socket } = useSocket();

  useEffect(() => {
    function onFooEvent(value: any) {
      setFooEvents((previous: string[]) => [...previous, value]);
    }
    socket.on("foo", onFooEvent);

    // return () => {
    //   socket.off("foo", onFooEvent);
    // };
  }, [socket]);

  return (
    <div className="App">
      <div
        className={`p-4 ${isConnected ? "bg-green-100" : "bg-red-100"}`}
        suppressHydrationWarning
      >
        Status: {isConnected ? "✅ Connected" : "❌ Disconnected"}
      </div>
      <Events events={fooEvents} />
      <MyForm />
    </div>
  );
}
