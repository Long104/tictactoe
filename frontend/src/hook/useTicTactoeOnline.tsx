"use client";
import { useEffect, useState } from "react";
import { useRoom } from "@/hook/useRoom";

export function useTicTacToe(roomId: string, player: string) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [roleScore, setRoleScore] = useState({ oScore: 0, xScore: 0 });
  const [gameStatus, setGameStatus] = useState("");
  const { joinRoom, leaveRoom, sendMove, socket } = useRoom(roomId);
  const [role, setRole] = useState<"X" | "O">();
  const [turn, setTurn] = useState("");

  useEffect(() => {
    joinRoom();

    socket.on("roomMoveUpdate", (data) => {
      const { position, currentMovePlayer, turn, board, role } = data;
      if (currentMovePlayer !== player) setTurn(turn);
      setBoard(board);
    });

    return () => {
      leaveRoom;
    };
  });

  function resetGame() {
    setBoard(Array(9).fill(null));
  }

  function resetScore() {
    setRoleScore({ oScore: 0, xScore: 0 });
  }

  function gameCheckStatus(boardPosition: any) {
    // |0|1|2|
    // |3|4|5|
    // |6|7|8|
    const gameCheckWinPosition = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 4, 6],
      [2, 5, 8],
      [3, 4, 5],
      [6, 7, 8],
    ];

    for (const [a, b, c] of gameCheckWinPosition) {
      if (
        boardPosition[a] &&
        boardPosition[b] == boardPosition[a] &&
        boardPosition[c] == boardPosition[a]
      ) {
        setGameStatus(boardPosition[a]);
      } else if (board.every((x) => x !== null)) {
        setGameStatus("draw");
      }
    }
  }

  function changeBoardPositionRole(position: number, role: string) {
    setBoard((prev) => {
      const Board = [...prev];
      Board[position] = role;
      return Board;
    });
    sendMove({
      position,
      currentMovePlayer: player,
      role,
      roomId,
      turn,
      board,
      player,
    });
  }

  return {
    board,
    setBoard,
    resetGame,
    resetScore,
    roleScore,
    gameCheckStatus,
    gameStatus,
    changeBoardPositionRole,
    role,
  };
}
