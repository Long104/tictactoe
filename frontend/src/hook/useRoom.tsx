"use client";
import { useSocket } from "./useSocket";

export function useRoom(roomId: string) {
  const { socket } = useSocket();
  const joinRoom = () => {
    socket.emit("joinRoom", roomId);
  };
  const leaveRoom = () => {
    socket.emit("leaveRoom", roomId);
  };
  const sendMove = (moveData: {
    position: number;
    currentMovePlayer: string;
    role: string;
    roomId: string;
    board: string[];
    turn: string;
    player:string;
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
