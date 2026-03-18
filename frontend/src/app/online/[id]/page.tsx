"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IconArrowLeft, IconRefresh } from "@tabler/icons-react";
import { SessionStorageAdapter } from "@/infrastructure";
import { useTicTacToeOnline } from "@/presentation";

const storage = new SessionStorageAdapter();

export default function OnlinePage() {
  const params = useParams();
  const roomId = params.id as string;
  const [player, setPlayer] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const name = storage.get<string>("ttt_name") || "Player";
    const sid = storage.get<string>("ttt_sessionId") || crypto.randomUUID();
    storage.set("ttt_sessionId", sid);
    setPlayer(name);
    setSessionId(sid);
  }, []);

  const { board, gameStatus, role, turn, score, makeMove, resetGame, resetScore } = useTicTacToeOnline(roomId, player, sessionId);

  const getCellClass = (value: string, index: number) => {
    const classes = ["board-cell"];
    if (value) classes.push("board-cell--filled");
    if (value === "X") classes.push("board-cell--x");
    if (value === "O") classes.push("board-cell--o");
    if (gameStatus !== "") classes.push("board-cell--disabled");
    return classes.join(" ");
  };

  const isMyTurn = role === turn;

  return (
    <div style={{ minHeight: "100dvh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1rem", gap: "1.5rem" }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500, alignSelf: "flex-start" }}><IconArrowLeft size={18} />Back to Home</Link>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Online Game</h1>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <div className="status-badge status-badge--x">You are: {role || "..."}</div>
        <div className={`status-badge ${isMyTurn ? "status-badge--active" : ""}`}>{isMyTurn ? "Your Turn" : "Waiting..."}</div>
      </div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <div className="score-badge score-badge--x"><span className="score-badge__label">X Score</span><span className="score-badge__number">{score.xScore}</span></div>
        <div className="score-badge score-badge--o"><span className="score-badge__label">O Score</span><span className="score-badge__number">{score.oScore}</span></div>
      </div>
      <div className="board-grid">
        {board.map((cell, index) => <button key={index} type="button" className={getCellClass(cell, index)} onClick={() => makeMove(index)} disabled={!role || !isMyTurn || cell !== ""}>{cell && <span className="cell-symbol">{cell}</span>}</button>)}
      </div>
      <div className="turn-indicator"><span className={`turn-dot ${turn === "X" ? "turn-dot--x" : "turn-dot--o"}`} /><span>Current Turn: {turn || "X"}</span></div>
      <div className="action-row">
        <button type="button" className="action-btn" onClick={resetGame}><IconRefresh size={16} />New Game</button>
        <button type="button" className="action-btn" onClick={resetScore}>Reset Score</button>
      </div>
    </div>
  );
}