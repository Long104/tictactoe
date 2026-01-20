"use client";
import { socket } from "@/socket";

export function playGameSearchOnline() {
  socket.emit("searchRoom");
}

export function createRoom(
  data: { roomName: string; player: string },
  close: () => void,
) {
  socket.emit("createRoom", data);
  close();
}
