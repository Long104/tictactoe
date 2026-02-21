"use client";
import { useState } from "react";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export type GameStatus = "" | "X" | "O" | "draw";

export function useTicTacToe() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [gameStatus, setGameStatus] = useState<GameStatus>("");
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);

  /**
   * Check the given board snapshot for a winner.
   * Returns the winning line indices, or null if no winner.
   */
  function checkWinner(b: string[]): { winner: string; line: number[] } | null {
    for (const [a, c1, c2] of WIN_LINES) {
      if (b[a] && b[a] === b[c1] && b[a] === b[c2]) {
        return { winner: b[a], line: [a, c1, c2] };
      }
    }
    return null;
  }

  function makeMove(position: number) {
    if (board[position] !== "" || gameStatus !== "") return;

    const newBoard = [...board];
    newBoard[position] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);

    if (result) {
      setGameStatus(result.winner as GameStatus);
      setWinningLine(result.line);
      if (result.winner === "X") setXScore((p) => p + 1);
      else setOScore((p) => p + 1);
      return { event: "win" as const, winner: result.winner };
    }

    if (newBoard.every((c) => c !== "")) {
      setGameStatus("draw");
      return { event: "draw" as const };
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    return { event: "move" as const };
  }

  function resetGame() {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
    setGameStatus("");
    setWinningLine([]);
  }

  function resetScore() {
    setXScore(0);
    setOScore(0);
  }

  return {
    board,
    currentPlayer,
    gameStatus,
    winningLine,
    xScore,
    oScore,
    makeMove,
    resetGame,
    resetScore,
  };
}
