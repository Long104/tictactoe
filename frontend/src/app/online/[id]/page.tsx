"use client";
import { SimpleGrid, Textarea } from "@mantine/core";
import { useTicTacToe } from "@/hook/useTicTactoeOnline";
import { useSessionStorage } from "@/hook/useSessionStorage";
import { useState, use, useEffect } from "react";
import { useRoom } from "@/hook/useRoom";

type ChatMessageType = {
  from: string;
  message: string;
};

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { socket, sendChat } = useRoom(id);
  const [chatMessage, setChatMessage] = useState<ChatMessageType[]>([]);
  const [player, setPlayer] = useState<string>("");
  const { setValue, getValue, clearValue } = useSessionStorage();
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    socket.emit("playWithFriend", { roomId: id });
    // gen random number
    function generateRandomName() {
      const random = crypto
        .getRandomValues(new Uint32Array(1))[0]
        .toString()
        .slice(0, 5);
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
    console.log("sessionId", sessionId);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      setValue("ttt_sessionId", sessionId);
      console.log(getValue("ttt_sessionId"));
      setSessionId(sessionId);
    } else {
      setSessionId(getValue("ttt_sessionId")!);
    }

    // Listen for room-specific events
    socket.on("roomChatUpdate", (data: ChatMessageType) => {
      setChatMessage((prev: ChatMessageType[]) => [...prev, data]);
      console.log("Chat:", data);
    });

    return () => {
      socket.off("roomChatUpdate");
    };
  }, [id]);

  const {
    resetScore,
    resetGame,
    board,
    roleScore,
    gameCheckStatus,
    gameStatus,
    changeBoardPositionRole,
    role,
    turn,
  } = useTicTacToe(id, player, sessionId);

  // Check for win/draw conditions
  useEffect(() => {
    if (board.some((cell) => cell !== null)) {
      gameCheckStatus(board);
    }
  }, [board]);

  function handleRoomChat(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const value = e.currentTarget.value;
      sendChat(player, value);
      e.currentTarget.value = "";
    }
  }
  return (
    <>
      <div className="relative w-svw h-svh grid grid-cols-1 lg:grid-cols-[60%_40%] xl:grid-cols-3 place-items-center">
        {/* Chat for large screens */}
        <div className="flex flex-col justify-end max-xl:hidden relative w-[18rem] h-[18rem] sm:w-[18rem] sm:h-[24rem] md:w-[20rem] md:h-[28rem] lg:w-[20rem] lg:h-[32rem] 2xl:w-[24rem] 2xl:h-[36rem] bg-black/80 rounded-xl text-white mix-blend-multiply">
          <div className="flex-1 overflow-y-auto p-2 items-self-end">
            {chatMessage && (
              <div>
                {chatMessage.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 bg-gray-500 rounded-lg mb-6 ${msg.from == player ? "justify-self-end" : "justify-self-start"}`}
                  >
                    {msg.from != player && (
                      <span>
                        {msg.from} {"> "}
                      </span>
                    )}
                    {msg.message}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Textarea
            placeholder="Chat with friend"
            w={"100%"}
            onKeyDown={handleRoomChat}
            className="p-4"
          />
        </div>
        {/* Game Board */}
        <div className="flex justify-center items-center relative rounded-lg h-full w-full flex-col">
          <div className="lg:hidden text-5xl py-2 px-6 rounded-lg my-2 bg-black/80 mix-blend-multiply text-white">
            X : {roleScore.xScore}
          </div>
          <SimpleGrid
            cols={3}
            spacing={"sm"}
            className="auto-rows-fr w-[18rem] h-[18rem] sm:w-sm sm:h-[24rem] md:w-md md:h-[28rem] lg:w-lg lg:h-[32rem] 2xl:w-[36rem] 2xl:h-[36rem]"
          >
            {board.map((cellRole, index) => (
              <div
                key={index}
                onClick={() => changeBoardPositionRole(index)}
                className={`
                  bg-black/80 mix-blend-multiply text-white h-full w-full rounded-xl flex items-center justify-center font-bold text-6xl sm:text-7xl lg:text-8xl xl:text-9xl 
                  ${
                    // Disable click if not my turn OR cell is already filled
                    turn === role && cellRole === "" && gameStatus === ""
                      ? "cursor-pointer hover:bg-gray-500"
                      : "cursor-not-allowed pointer-events-none"
                  }
`}
              >
                {cellRole}
                {/* {board[index]} */}
              </div>
            ))}
          </SimpleGrid>
          <div className="lg:hidden text-5xl py-2 px-6 rounded-lg my-2 bg-black/80 mix-blend-multiply text-white">
            O : {roleScore.oScore}
          </div>
          <button className="flex justify-center items-center lg:hidden text-white mix-blend-multiply font-bold cursor-pointer select-none p-6 mt-6 rounded-lg">
            {gameStatus ? (
              <div className="flex *:m-4">
                <div
                  className="text-lg bg-black/80 p-4 rounded-lg text-center"
                  onClick={resetGame}
                >
                  Play again
                </div>
                <div
                  className="text-lg bg-black/80 p-4 rounded-lg text-center"
                  onClick={resetScore}
                >
                  Reset score
                </div>
              </div>
            ) : (
              <div className="text-lg bg-black/80 p-4 rounded-lg">
                {role
                  ? `You are ${role} - ${turn === role ? "Your turn" : "Opponent's turn"}`
                  : "Waiting for game to start..."}
              </div>
            )}
          </button>
        </div>
        {/* Score Panel */}
        <div className="hidden lg:block relative w-[18rem] h-[18rem] sm:w-[18rem] sm:h-[24rem] md:w-[20rem] md:h-[28rem] lg:w-[20rem] lg:h-[32rem] 2xl:w-[24rem] 2xl:h-[36rem] bg-black/80 rounded-xl text-white mix-blend-multiply">
          <div className="grid h-full w-full grid-rows-3 place-items-center">
            <div className="text-8xl">X : {roleScore.xScore}</div>
            <div className="h-full w-full flex justify-center items-center flex-col">
              <div className="flex flex-1 h-full w-full justify-center items-center bg-gray-600">
                {gameStatus == "X"
                  ? "X won game"
                  : gameStatus == "O"
                    ? "O Wins!"
                    : gameStatus == "draw"
                      ? "The game is draw"
                      : role
                        ? `You are ${role} - ${turn === role ? "Your turn" : "Opponent's turn"}`
                        : "Waiting for game to start..."}
              </div>
              <button className="font-bold block cursor-pointer select-none flex-1 bg-gray-500 h-full w-full">
                {gameStatus ? (
                  <div className="grid grid-cols-2 h-full w-full">
                    <span
                      className="hover:bg-black/80 w-full h-full grid place-items-center"
                      onClick={resetGame}
                    >
                      Play again
                    </span>
                    <span
                      className="hover:bg-black/80 w-full h-full grid place-items-center"
                      onClick={resetScore}
                    >
                      resetScore
                    </span>
                  </div>
                ) : (
                  "You In game"
                )}
              </button>
            </div>
            <div className="text-8xl">O : {roleScore.oScore}</div>
          </div>
        </div>
      </div>
      {/* Chat for small screens */}
      <div className="relative flex justify-center col items-end h-full w-full p-4 xl:hidden">
        <div className="flex flex-col justify-end w-[18rem] h-[18rem] sm:w-[24rem] sm:h-[24rem] md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] 2xl:w-[36rem] 2xl:h-[36rem] p-4 xl:hidden bg-black/80 rounded-xl text-white mix-blend-multiply">
          <div className="flex-1 overflow-y-auto p-2 items-self-end">
            {chatMessage && (
              <div>
                {chatMessage.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 bg-gray-500 rounded-lg mb-6 ${msg.from == player ? "justify-self-end" : "justify-self-start"}`}
                  >
                    {msg.from != player && (
                      <span>
                        {msg.from} {"> "}
                      </span>
                    )}
                    {msg.message}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Textarea
            placeholder="Chat with friend"
            w={"100%"}
            onKeyDown={handleRoomChat}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
