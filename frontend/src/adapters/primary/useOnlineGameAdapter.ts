"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { SocketIOAdapter } from "../secondary/SocketIOAdapter";
import { SessionStorageAdapter } from "../secondary/SessionStorageAdapter";
import { GameLogic } from "../../core/services/GameLogic";

const socket = new SocketIOAdapter();
const storage = new SessionStorageAdapter();

export function useOnlineGameAdapter(roomId: string, player: string, sessionId: string) {
  const socketRef = useRef(socket);
  const [state, setState] = useState({
    board: Array(9).fill(""),
    currentTurn: "X" as "X" | "O",
    role: undefined as "X" | "O" | undefined,
    turn: "",
    score: { xScore: 0, oScore: 0 },
    gameStatus: "",
  });

  useEffect(() => {
    socketRef.current.connect();
    socketRef.current.on("connect", () => console.log("Socket connected"));
    socketRef.current.on("roomMoveUpdate", (data: any) => {
      const { position, turn, board, role, score } = data;
      setState(prev => ({ ...prev, board, turn, score }));
      const gameStatus = GameLogic.checkWinner(board);
      if (gameStatus) setState(prev => ({ ...prev, gameStatus: gameStatus.winner }));
      else if (board.every((c: string) => c !== "")) setState(prev => ({ ...prev, gameStatus: "draw" }));
    });
    socketRef.current.on("roleRestored", (data: any) => { const { role, board, currentTurn, score } = data; setState(prev => ({ ...prev, role, board, turn: currentTurn, score })); });
    socketRef.current.on("waitForOpponent", (data: any) => { const { role, currentTurn } = data; setState(prev => ({ ...prev, role, turn: currentTurn })); });
    socketRef.current.on("waiting", () => console.log("Waiting..."));
    socketRef.current.on("error", (data: any) => console.log("error", data.message));
    socketRef.current.on("resetScoreRoomClient", (data: any) => setState(prev => ({ ...prev, score: data.score })));
    return () => {
      socketRef.current.off("roomMoveUpdate"); socketRef.current.off("roleRestored"); socketRef.current.off("waitForOpponent"); socketRef.current.off("waiting"); socketRef.current.off("error"); socketRef.current.off("resetScoreRoomClient"); socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => { if (!sessionId) return; socketRef.current.emit("waitingRoom", { sessionId, roomId }); }, [roomId, sessionId]);

  const makeMove = useCallback((position: number) => {
    if (!state.role || state.turn !== state.role) { console.log("Not your turn!"); return; }
    const newBoard = [...state.board];
    newBoard[position] = state.role;
    socketRef.current.emit("roomMove", { position, currentMovePlayer: player, role: state.role, roomId, board: newBoard, turn: state.role === "X" ? "O" : "X", score: state.score });
    setState(prev => ({ ...prev, board: newBoard, turn: prev.role === "X" ? "O" : "X" }));
  }, [state.role, state.turn, state.board, state.score, player, roomId]);

  const resetGame = useCallback(() => { setState(prev => ({ ...prev, board: Array(9).fill(""), gameStatus: "" })); }, []);
  const resetScore = useCallback(() => { socketRef.current.emit("resetScore", { roomId }); setState(prev => ({ ...prev, score: { xScore: 0, oScore: 0 } })); }, [roomId]);

  return { board: state.board, currentPlayer: state.currentTurn, gameStatus: state.gameStatus, role: state.role, turn: state.turn, score: state.score, makeMove, resetGame, resetScore };
}

export default useOnlineGameAdapter;