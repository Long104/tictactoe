import { PlayerRole } from "../../core/domain";

export interface NotificationPort {
  emitToRoom(roomId: string, event: string, data: unknown): void;
  emitToSocket(socketId: string, event: string, data: unknown): void;
  emitToAll(event: string, data: unknown): void;
  joinSocketToRoom(socketId: string, roomId: string): void;
  leaveSocketFromRoom(socketId: string, roomId: string): void;
  getSocketsInRoom(roomId: string): string[];
}

export interface RoomMovePayload {
  position: number;
  currentMovePlayer: string;
  turn: PlayerRole;
  board: string[];
  role: PlayerRole;
  score: { xScore: number; oScore: number };
}