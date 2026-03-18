"use client";
import { useState, useCallback } from "react";
import { GameLogic } from "../../core/services/GameLogic";

export function useTicTacToeAdapter() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [currentTurn, setCurrentTurn] = useState<"X" | "O">("X");
  const [gameStatus, setGameStatus] = useState<"" | "X" | "O" | "draw">("");
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);

  const makeMove = useCallback((position: number) => {
    if (board[position] !== "" || gameStatus !== "") return null;
    const result = GameLogic.makeMove(board, position, currentTurn);
    setBoard(result.board);
    setCurrentTurn(result.currentTurn);
    if (result.winner) { setGameStatus(result.winner); setWinningLine(result.winningLine || []); if (result.winner === "X") setXScore(p => p + 1); else setOScore(p => p + 1); }
    else if (result.isDraw) setGameStatus("draw");
    return result;
  }, [board, currentTurn, gameStatus]);

  const resetGame = useCallback(() => { setBoard(Array(9).fill("")); setCurrentTurn("X"); setGameStatus(""); setWinningLine([]); }, []);
  const resetScore = useCallback(() => { setXScore(0); setOScore(0); }, []);

  return { board, currentPlayer: currentTurn, gameStatus, winningLine, xScore, oScore, makeMove, resetGame, resetScore };
}

export default useTicTacToeAdapter;