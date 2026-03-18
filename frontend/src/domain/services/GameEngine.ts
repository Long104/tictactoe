export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export type WinLine = (typeof WIN_LINES)[number];
export type PlayerSymbol = "X" | "O";

export interface MoveResult {
  valid: boolean;
  board: string[];
  currentTurn: PlayerSymbol;
  gameOver: boolean;
  winner: PlayerSymbol | null;
  winningLine: number[] | null;
  isDraw: boolean;
}

export function checkWinner(board: string[]): { winner: PlayerSymbol; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as PlayerSymbol, line: [...line] };
    }
  }
  return null;
}

export function isDraw(board: string[]): boolean {
  return board.every(cell => cell !== "");
}

export function makeMove(
  board: string[],
  position: number,
  player: PlayerSymbol
): MoveResult {
  if (position < 0 || position > 8 || board[position] !== "") {
    return {
      valid: false,
      board,
      currentTurn: board.filter(c => c !== "").length % 2 === 0 ? "X" : "O",
      gameOver: false,
      winner: null,
      winningLine: null,
      isDraw: false,
    };
  }

  const newBoard = [...board];
  newBoard[position] = player;
  
  const result = checkWinner(newBoard);
  const draw = isDraw(newBoard);

  if (result) {
    return {
      valid: true,
      board: newBoard,
      currentTurn: player,
      gameOver: true,
      winner: result.winner,
      winningLine: result.line,
      isDraw: false,
    };
  }

  if (draw) {
    return {
      valid: true,
      board: newBoard,
      currentTurn: player,
      gameOver: true,
      winner: null,
      winningLine: null,
      isDraw: true,
    };
  }

  return {
    valid: true,
    board: newBoard,
    currentTurn: player === "X" ? "O" : "X",
    gameOver: false,
    winner: null,
    winningLine: null,
    isDraw: false,
  };
}

export function validateMove(board: string[], position: number): boolean {
  return position >= 0 && position < 9 && board[position] === "";
}

export default {
  checkWinner,
  isDraw,
  makeMove,
  validateMove,
  WIN_LINES,
};