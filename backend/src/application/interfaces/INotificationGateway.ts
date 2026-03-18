import { PlayerRole } from "../../domain/entities";

export interface INotificationGateway {
  emitToRoom(roomId: string, event: string, data: unknown): void;
  emitToSocket(socketId: string, event: string, data: unknown): void;
  emitToAll(event: string, data: unknown): void;
  joinRoom(socketId: string, roomId: string): void;
  leaveRoom(socketId: string, roomId: string): void;
  getSocketsInRoom(roomId: string): string[];
}

export interface RoomMoveNotification {
  position: number;
  currentMovePlayer: string;
  turn: PlayerRole;
  board: string[];
  role: PlayerRole;
  score: { xScore: number; oScore: number };
}

export interface PlayerJoinedNotification {
  roomId: string;
  player: {
    name: string;
    role: PlayerRole;
  };
}

export interface GameStartedNotification {
  roomId: string;
  players: {
    X: { name: string; sessionId: string };
    O: { name: string; sessionId: string };
  };
  currentTurn: PlayerRole;
}

export interface WaitingNotification {
  message: string;
}

export interface ErrorNotification {
  message: string;
}