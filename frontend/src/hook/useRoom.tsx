"use client";
import { useSocket } from "./useSocket";
import { useSessionStorage } from "@hook/useSessionStorage";

export function useRoom(roomId: string) {
  const { socket } = useSocket();
  const { getValue, setValue, clearValue } = useSessionStorage();
  const sessionId = getValue("ttt_sessionId") ?? "";
  const joinRoom = () => {
    // set room ID in game state
    // handle joinroom and waiting
    // socket.emit("joinRoom", { roomId });
    socket.emit("waitingRoom", {
      roomId,
      sessionId,
    });
  };
  const leaveRoom = () => {
    // clear game state when leaving
    socket.emit("leaveRoom", roomId);
  };

  const sendMove = (moveData: {
    position: number;
    currentMovePlayer: string;
    role: string;
    roomId: string;
    board: string[];
    turn: string;
    score: { oScore: number; xScore: number };
  }) => {
    socket.emit("roomMove", moveData);
  };

  const sendChat = (player: string, chatData: string) => {
    socket.emit("roomChatBroadcast", {
      roomId,
      from: player,
      message: chatData,
    });
  };

  return { joinRoom, leaveRoom, sendMove, socket, sendChat };
}
