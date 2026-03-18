export type GameStatus = "waiting" | "playing" | "won" | "draw";

export interface GameState {
  board: string[];
  currentTurn: "X" | "O";
  status: GameStatus;
  winner: "X" | "O" | null;
  winningLine: number[] | null;
}

export function createInitialGameState(): GameState {
  return {
    board: Array(9).fill(""),
    currentTurn: "X",
    status: "waiting",
    winner: null,
    winningLine: null,
  };
}

export function isBoardFull(board: string[]): boolean {
  return board.every((cell) => cell !== "");
}