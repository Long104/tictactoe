"use client";
import { Textarea } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useSessionStorage } from "@/hook/useSessionStorage";

type OpenChatMessageType = {
  from: string;
  message: string;
};

const page = () => {
  const [openChatMessage, setOpenChatMessage] =
    useState<OpenChatMessageType[]>();
  const [player, setPlayer] = useState<string>();
  const { getValue, setValue, clearValue } = useSessionStorage();

  function handleOpenChat(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const value = e.currentTarget.value;
      setOpenChatMessage((prev) => [
        ...(prev || []),
        { from: player!, message: value },
      ]);
      socket.emit("openChatBroadcast", { from: player, message: value });
      e.currentTarget.value = "";
    }
  }

  useEffect(() => {
    socket.on("openChatUpdate", (value) => {
      setOpenChatMessage((prev) => [...(prev || []), value]);
    });
    // gen random number
    function generateRandomName() {
      const random = crypto
        .getRandomValues(new Uint32Array(1))[0]
        .toString()
        .slice(0, 5);
      setPlayer(`guest${random}`);
      return `guest${random}`;
    }
    // set name if there is non in sessionStorage
    const name = getValue("ttt_name");
    if (!name) {
      setValue("ttt_name", generateRandomName());
      setPlayer(generateRandomName());
    } else {
      // if there is
      setPlayer(getValue("ttt_name"));
    }

    let sessionId = getValue("ttt_sessionId");

    console.log("sessionid", sessionId);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      setValue("ttt_sessionId", sessionId);
      console.log(getValue("ttt_sessionId"));
    }

    return () => {
      socket.off("openChatUpdate");
    };
  }, []);

  return (
    <div className="relative w-svw min-h-svh grid grid-cols-1 md:grid-cols-2 gap-4 p-4 place-items-center">
      {/* choose between online and offline */}
      <div className="p-4 *:text-4xl w-full h-2/3 bg-black/80 text-white mix-blend-multiply grid grid-rows-4 place-items-center rounded-lg">
        <Link href={"online/1"} className="w-full h-full ">
          <div className="p-6 hover:bg-gray-500 w-full h-full grid place-items-center rounded-lg">
            Play Online
          </div>
        </Link>
        <Link href={"offline"} className="w-full h-full">
          <div className="p-6 hover:bg-gray-500 w-full h-full grid place-items-center rounded-lg">
            Play Offline
          </div>
        </Link>
        <Link href={"playWithFriend"} className="w-full h-full">
          <div className="p-6 hover:bg-gray-500 w-full h-full grid place-items-center rounded-lg">
            Play Friend
          </div>
        </Link>
        <Link href={"createRoom"} className="w-full h-full">
          <div className="p-6 hover:bg-gray-500 w-full h-full grid place-items-center rounded-lg">
            Create Room
          </div>
        </Link>
      </div>
      {/* open chat */}
      <div className="flex flex-col justify-end w-full h-96 md:h-2/3 bg-black/80 text-white mix-blend-multiply rounded-lg">
        <div className="flex-1 overflow-y-auto p-2 items-self-end">
          {openChatMessage && (
            <div>
              {openChatMessage.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 bg-gray-500 rounded-lg m-6 ${msg.from == player ? "justify-self-end" : "justify-self-start"}`}
                >
                  {msg.from != player && (
                    <span>
                      {msg.from} {"> "}
                    </span>
                  )}
                  <span>{msg.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
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
