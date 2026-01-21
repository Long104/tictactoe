"use client";
import { useEffect, useState } from "react";
import { useRoom } from "@/hook/useRoom";

export function useTicTacToe(
  roomId: string,
  player: string,
  sessionId: string,
) {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [roleScore, setRoleScore] = useState({ oScore: 0, xScore: 0 });
  const [gameStatus, setGameStatus] = useState("");
  const { joinRoom, leaveRoom, sendMove, socket } = useRoom(roomId);
  const [role, setRole] = useState<"X" | "O">();
  const [turn, setTurn] = useState("");

  useEffect(() => {
    // join room
    if (!sessionId) {
      console.log("Waiting for sessionId...");
      return;
    }
    console.log("Joining room with sessionId", sessionId);
    joinRoom(sessionId);

    // listen for board updates
    socket.on("roomMoveUpdate", (data) => {
      const { position, currentMovePlayer, turn, board, role, score } = data;
      setTurn(turn);
      console.log("board", board);
      setBoard(board);
      setRoleScore(score);
    });

    // role restore
    socket.on("roleRestored", (data) => {
      const { role, board, currentTurn, score } = data;
      console.log("data role restore:", data);
      setRole(role);
      setBoard(board);
      setTurn(currentTurn);
      setRoleScore(score);
    });

    // Listen for role assignment (new game)
    socket.on("waitForOpponent", (data) => {
      const { role, currentTurn } = data;
      setRole(role);
      setTurn(currentTurn);
      console.log("role assigned:", role);
    });

    // Listen for waiting
    socket.on("waiting", (message) => {
      console.log("wait...", message);
    });

    socket.on("error", (message) => {
      console.log("error", message);
    });

    return () => {
      leaveRoom();
      socket.off("roomMoveUpdate");
      socket.off("waitForOpponent");
      socket.off("waiting");
      socket.off("roleRestored");
    };
  }, [roomId, player, sessionId]);

  function resetGame() {
    setBoard(Array(9).fill(""));
    setGameStatus("");
  }

  function resetScore() {
    setRoleScore({ oScore: 0, xScore: 0 });
  }

  function gameCheckStatus(boardPosition: any) {
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
        boardPosition[a] == "X"
          ? setRoleScore((prev) => ({
              ...prev,
              xScore: prev.xScore + 1,
            }))
          : setRoleScore((prev) => ({
              ...prev,
              oScore: prev.oScore + 1,
            }));
      } else if (board.every((x) => x !== "")) {
        setGameStatus("draw");
      }
    }
  }

  function changeBoardPositionRole(position: number) {
    // Only allow move if it's your turn
    if (turn !== role) {
      console.log("not your turn!");
      return;
    }

    setBoard((prev) => {
      const newBoard = [...prev];
      newBoard[position] = role;
      return newBoard;
    });

    const newBoard = [...board];
    newBoard[position] = role;

    console.log("newboard", newBoard);
    sendMove({
      position,
      currentMovePlayer: player,
      role: role,
      roomId,
      board: newBoard,
      turn: role === "X" ? "O" : "X",
      score: roleScore,
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
    turn,
  };
}
