"use client";
import { Textarea, Modal, TextInput, Button, Table } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useSessionStorage } from "@/hook/useSessionStorage";
import { playGameSearchOnline, createRoom } from "@/lib/homePageFunction";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { Input } from "postcss";

type OpenChatMessageType = {
  from: string;
  message: string;
};

const page = () => {
  const [openChatMessage, setOpenChatMessage] =
    useState<OpenChatMessageType[]>();
  const [player, setPlayer] = useState<string>("");
  const { getValue, setValue, clearValue } = useSessionStorage();
  const [roomName, setRoomName] = useState<string>("");
  const router = useRouter();
  const [dashboardRoom, setDashboardRoom] = useState<
    { player: string; roomName: string; roomId: string }[]
  >([]);

  const [opened, { open, close }] = useDisclosure(false);

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
    function findRoom(data: { id: number }) {
      const { id } = data;
      router.push(`/online/${id}`);
    }

    function room() {}

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
      setPlayer(getValue("ttt_name")!);
    }

    let sessionId = getValue("ttt_sessionId");

    console.log("sessionid", sessionId);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      setValue("ttt_sessionId", sessionId);
      console.log(getValue("ttt_sessionId"));
    }

    socket.on("openChatUpdate", (value) => {
      setOpenChatMessage((prev) => [...(prev || []), value]);
    });
    socket.on("findRoom", findRoom);

    socket.on(
      "dashboard",
      (value: { player: string; roomName: string; roomId: string }[]) => {
        setDashboardRoom(value);
      },
    );

    socket.emit("getDashboard");

    return () => {
      socket.off("openChatUpdate");
      socket.off("findRoom");
      socket.off("dashboard");
      socket.off("getDashboard");
    };
  }, []);

  function handleChooseRoom(roomId: string) {
    socket.emit("chooseRoom", { roomId });
  }

  return (
    <div className="relative w-svw min-h-svh p-4 grid grid-cols-2 gap-4 place-items-center">
      <Modal opened={opened} onClose={close} title="Create Room Name">
        <TextInput
          label="Room Name"
          description="Input your room name"
          placeholder="play me bro room"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setRoomName(e.currentTarget.value);
          }}
        />
        <Button
          mt={"xs"}
          onClick={() => createRoom({ roomName, player }, close)}
          variant="light"
        >
          Create Your Room
        </Button>
      </Modal>
      {/* choose between online and offline */}
      <div className="grid grid-rows-2 h-full w-full gap-4">
        <div className="p-4 *:text-4xl w-full h-full bg-black/80 text-white mix-blend-multiply grid grid-rows-4 place-items-center rounded-lg">
          <div
            onClick={playGameSearchOnline}
            className="p-6 hover:bg-gray-500 w-full h-full grid place-items-center rounded-lg cursor-pointer"
          >
            Play Online
          </div>
          <Link href={"offline"} className="w-full h-full cursor-pointer">
            <div className="p-6 hover:bg-gray-500 w-full h-full grid place-items-center rounded-lg">
              Play Offline
            </div>
          </Link>
          <Link
            href={"playWithFriend"}
            className="w-full h-full cursor-pointer"
          >
            <div className="p-6 hover:bg-gray-500 w-full h-full grid place-items-center rounded-lg">
              Play Friend
            </div>
          </Link>
          <div
            className="p-6 hover:bg-gray-500 w-full h-full grid place-items-center rounded-lg cursor-pointer"
            onClick={open}
          >
            Create Room
          </div>
        </div>
        <div className="bg-black/80 w-full h-full rounded-lg overflow-y-auto mix-blend-multiply text-white">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>name</Table.Th>
                <Table.Th>player</Table.Th>
                <Table.Th>name</Table.Th>
                {/* <Table.Th>time</Table.Th> */}
                {/* <Table.Th>mode</Table.Th> */}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {dashboardRoom.map((d, i) => (
                <Table.Tr
                  key={i}
                  onClick={() => handleChooseRoom(d.roomId)}
                  className="hover:bg-gray-500"
                >
                  <Table.Td>{d.roomName}</Table.Td>
                  <Table.Td>{d.player}</Table.Td>
                  <Table.Td>{d.roomId}</Table.Td>
                  {/* <Table.Td>1+1 or 1</Table.Td> */}
                  {/* <Table.Td>casual or rank</Table.Td> */}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>
      <div className="flex flex-col justify-end w-full h-full bg-black/80 text-white mix-blend-multiply rounded-lg">
        {/* open chat */}
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
