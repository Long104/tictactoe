"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { SocketAdapter } from "@/infrastructure";
import { GameEngine } from "@/domain";

interface OnlineGameState {
  board: string[];
  currentTurn: "X" | "O";
  role: "X" | "O" | undefined;
  turn: string;
  score: { xScore: number; oScore: number };
  gameStatus: string;
}

export function useTicTacToe(roomId: string, player: string, sessionId: string) {
  const socketRef = useRef<SocketAdapter | null>(null);
  const [state, setState] = useState<OnlineGameState>({
    board: Array(9).fill(""),
    currentTurn: "X",
    role: undefined,
    turn: "",
    score: { xScore: 0, oScore: 0 },
    gameStatus: "",
  });

  useEffect(() => {
    socketRef.current = new SocketAdapter();
    const socket = socketRef.current;

    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("roomMoveUpdate", (data: any) => {
      const { position, turn, board, role, score } = data;
      setState((prev) => ({
        ...prev,
        board,
        turn,
        score,
      }));

      const gameStatus = GameEngine.checkWinner(board);
      if (gameStatus) {
        setState((prev) => ({ ...prev, gameStatus: gameStatus.winner }));
      } else if (board.every((c: string) => c !== "")) {
        setState((prev) => ({ ...prev, gameStatus: "draw" }));
      }
    });

    socket.on("roleRestored", (data: any) => {
      const { role, board, currentTurn, score } = data;
      setState((prev) => ({
        ...prev,
        role,
        board,
        turn: currentTurn,
        score,
      }));
    });

    socket.on("waitForOpponent", (data: any) => {
      const { role, currentTurn } = data;
      setState((prev) => ({
        ...prev,
        role,
        turn: currentTurn,
      }));
    });

    socket.on("waiting", () => {
      console.log("Waiting for opponent...");
    });

    socket.on("error", (data: any) => {
      console.log("error", data.message);
    });

    socket.on("resetScoreRoomClient", (data: any) => {
      setState((prev) => ({ ...prev, score: data.score }));
    });

    return () => {
      socket.off("roomMoveUpdate");
      socket.off("roleRestored");
      socket.off("waitForOpponent");
      socket.off("waiting");
      socket.off("error");
      socket.off("resetScoreRoomClient");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!sessionId || !socketRef.current) return;

    socketRef.current.emit("waitingRoom", { sessionId, roomId });
  }, [roomId, sessionId]);

  const makeMove = useCallback(
    (position: number) => {
      if (!state.role || state.turn !== state.role) {
        console.log("Not your turn!");
        return;
      }

      const newBoard = [...state.board];
      newBoard[position] = state.role;

      socketRef.current?.emit("roomMove", {
        position,
        currentMovePlayer: player,
        role: state.role,
        roomId,
        board: newBoard,
        turn: state.role === "X" ? "O" : "X",
        score: state.score,
      });

      setState((prev) => ({
        ...prev,
        board: newBoard,
        turn: prev.role === "X" ? "O" : "X",
      }));
    },
    [state.role, state.turn, state.board, state.score, player, roomId]
  );

  const resetGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      board: Array(9).fill(""),
      gameStatus: "",
    }));
  }, []);

  const resetScore = useCallback(() => {
    socketRef.current?.emit("resetScore", { roomId });
    setState((prev) => ({
      ...prev,
      score: { xScore: 0, oScore: 0 },
    }));
  }, [roomId]);

  return {
    board: state.board,
    currentPlayer: state.currentTurn,
    gameStatus: state.gameStatus,
    role: state.role,
    turn: state.turn,
    score: state.score,
    makeMove,
    resetGame,
    resetScore,
  };
}

export default useTicTacToe;