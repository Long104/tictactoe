"use client";
import { Textarea } from "@mantine/core";
import Link from "next/link";
import react, { useEffect, useState } from "react";
import { socket } from "@/socket";

// [{from:"Ming",message:"Hello Ming"},{from:"Long",message:"Hello Long"}]
type OpenChatMessageType = {
  from: string;
  message: string;
};

const page = () => {
  const [openChatMessage, setOpenChatMessage] =
    useState<OpenChatMessageType[]>();
  const [player, setPlayer] = useState<string>();

  function handleOpenChat(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // e.preventDefault();
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const value = e.currentTarget.value;
      setOpenChatMessage((prev) => [
        ...(prev || []),
        { from: player!, message: value },
      ]);
      socket.emit("openChatBroadcast", { from: "long", message: value });
      e.currentTarget.value = "";
    }
  }

  useEffect(() => {
    (function () {
      const random = crypto
        .getRandomValues(new Uint32Array(1))[0]
        .toString()
        .slice(0, 5);
      setPlayer(`guest${random}`);
      return `guest${random}`;
    })();
  }, []);

  useEffect(() => {
    socket.on("openChat", (value) => {
      setOpenChatMessage((prev) => [...(prev || []), value]);
    });
  }, [socket]);

  return (
    <div className="relative w-svw h-svh grid grid-cols-1 md:grid-cols-2 place-items-center">
      {/* choose between online and offline */}
      <div className="*:text-4xl w-lg h-2/3 bg-black/80 text-white mix-blend-multiply grid grid-rows-2 place-items-center rounded-lg">
        <Link href={"online"} className="w-full h-full">
          <div className="p-6 hover:bg-gray-500 w-full h-full grid place-items-center rounded-lg">
            Play Online
          </div>
        </Link>
        <Link href={"offline"} className="w-full h-full">
          <div className="p-6 hover:bg-gray-500 w-full h-full grid place-items-center rounded-lg">
            Play Offline
          </div>
        </Link>
      </div>
      {/* open chat */}
      <div className="flex flex-col justify-end w-md h-2/3 bg-black/80 text-white mix-blend-multiply rounded-lg">
        {openChatMessage && (
          <div>
            {openChatMessage.map((msg, index) => (
              <div
                key={index}
                className={`p-4 bg-gray-500 rounded-lg m-6 ${msg.from == player ? "justify-self-end" : "justify-self-start"}`}
              >
                {msg.message}
              </div>
            ))}
          </div>
        )}
        <Textarea
          // label="Input label"
          // description="Input description"
          onKeyDown={handleOpenChat}
          placeholder="Chat with friend"
          w={"100%"}
          p={6}
        />
      </div>
    </div>
  );
};

export default page;
