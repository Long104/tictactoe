import { Player } from "./Player";

export interface Room {
  roomId: string;
  board: string[];
  currentTurn: "X" | "O";
  gameStarted: boolean;
  createdAt: number;
  score: { oScore: number; xScore: number };
  players: Map<string, Player>;
}

export interface RoomDTO {
  roomId: string;
  board: string[];
  currentTurn: "X" | "O";
  gameStarted: boolean;
  score: { oScore: number; xScore: number };
  playerCount: number;
}

export function createRoom(roomId: string): Room {
  return {
    roomId,
    board: Array(9).fill(""),
    currentTurn: "X",
    gameStarted: false,
    createdAt: Date.now(),
    score: { oScore: 0, xScore: 0 },
    players: new Map(),
  };
}

export function roomToDTO(room: Room): RoomDTO {
  return {
    roomId: room.roomId,
    board: room.board,
    currentTurn: room.currentTurn,
    gameStarted: room.gameStarted,
    score: room.score,
    playerCount: room.players.size,
  };
}

export function isRoom(obj: unknown): obj is Room {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "roomId" in obj &&
    "board" in obj &&
    "players" in obj
  );
}