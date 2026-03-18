"use client";
import { useState, useCallback } from "react";
import { GameEngine, MoveResult, createInitialGameState } from "@/domain";

export function useTicTacToe() {
  const [state, setState] = useState(createInitialGameState());

  const makeMove = useCallback((position: number): MoveResult | null => {
    if (state.board[position] !== "" || state.status !== "") {
      return null;
    }

    const result = GameEngine.makeMove(state.board, position, state.currentTurn);

    setState((prev) => ({
      board: result.board,
      currentTurn: result.currentTurn,
      status: result.winner || (result.isDraw ? "draw" : ""),
      winningLine: result.winningLine || [],
      xScore: result.winner === "X" ? prev.xScore + 1 : prev.xScore,
      oScore: result.winner === "O" ? prev.oScore + 1 : prev.oScore,
    }));

    return result;
  }, [state.board, state.currentTurn, state.status]);

  const resetGame = useCallback(() => {
    setState(createInitialGameState());
  }, []);

  const resetScore = useCallback(() => {
    setState((prev) => ({
      ...prev,
      xScore: 0,
      oScore: 0,
    }));
  }, []);

  return {
    board: state.board,
    currentPlayer: state.currentTurn,
    gameStatus: state.status,
    winningLine: state.winningLine,
    xScore: state.xScore,
    oScore: state.oScore,
    makeMove,
    resetGame,
    resetScore,
  };
}

export default useTicTacToe;