import { Board, isCellEmpty, isValidPosition } from "../value-objects/Board";

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
  board: Board;
  currentTurn: PlayerSymbol;
  gameOver: boolean;
  winner: PlayerSymbol | null;
  winningLine: number[] | null;
  isDraw: boolean;
}

export class GameEngine {
  static checkWinner(board: Board): { winner: PlayerSymbol; line: number[] } | null {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (
        board.cells[a] &&
        board.cells[a] === board.cells[b] &&
        board.cells[a] === board.cells[c]
      ) {
        return { winner: board.cells[a] as PlayerSymbol, line: [...line] };
      }
    }
    return null;
  }

  static isDraw(board: Board): boolean {
    return board.cells.every((cell) => cell !== "");
  }

  static makeMove(
    board: Board,
    position: number,
    player: PlayerSymbol
  ): MoveResult {
    if (!isValidPosition(position)) {
      return {
        valid: false,
        board,
        currentTurn: board.cells.filter((c) => c !== "").length % 2 === 0 ? "X" : "O",
        gameOver: false,
        winner: null,
        winningLine: null,
        isDraw: false,
      };
    }

    if (!isCellEmpty(board, position)) {
      return {
        valid: false,
        board,
        currentTurn: board.cells.filter((c) => c !== "").length % 2 === 0 ? "X" : "O",
        gameOver: false,
        winner: null,
        winningLine: null,
        isDraw: false,
      };
    }

    const newBoard = this.placeMove(board, position, player);
    const result = this.checkWinner(newBoard);
    const draw = this.isDraw(newBoard);

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

  static validateMove(board: Board, position: number): boolean {
    return isValidPosition(position) && isCellEmpty(board, position);
  }

  static getGameStatus(board: Board): "waiting" | "playing" | "won" | "draw" {
    const result = this.checkWinner(board);
    if (result) return "won";
    if (this.isDraw(board)) return "draw";
    if (board.cells.some((c) => c !== "")) return "playing";
    return "waiting";
  }

  private static placeMove(board: Board, position: number, value: "X" | "O"): Board {
    const newCells = [...board.cells];
    newCells[position] = value;
    return { ...board, cells: newCells };
  }
}

export default GameEngine;