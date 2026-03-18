export interface Room {
  roomId: string;
  board: string[];
  currentTurn: "X" | "O";
  gameStarted: boolean;
  createdAt: number;
  score: { oScore: number; xScore: number };
  players: Map<string, Player>;
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

export type { Player } from "../domain/Player";