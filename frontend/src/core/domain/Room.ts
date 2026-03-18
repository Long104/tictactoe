export interface Room {
  roomId: string;
  board: string[];
  currentTurn: "X" | "O";
  gameStarted: boolean;
  score: { xScore: number; oScore: number };
}

export function createRoom(roomId: string): Room {
  return { roomId, board: Array(9).fill(""), currentTurn: "X", gameStarted: false, score: { xScore: 0, oScore: 0 } };
}