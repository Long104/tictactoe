export type GameStatus = "" | "X" | "O" | "draw";

export interface GameState {
  board: string[];
  currentTurn: "X" | "O";
  status: GameStatus;
  winningLine: number[];
  xScore: number;
  oScore: number;
}

export function createInitialGameState(): GameState {
  return {
    board: Array(9).fill(""),
    currentTurn: "X",
    status: "",
    winningLine: [],
    xScore: 0,
    oScore: 0,
  };
}