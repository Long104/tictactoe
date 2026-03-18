"use client";
import Link from "next/link";
import { IconArrowLeft, IconRefresh } from "@tabler/icons-react";
import { useTicTacToe } from "@/presentation";

export default function OfflinePage() {
  const { board, currentPlayer, gameStatus, winningLine, xScore, oScore, makeMove, resetGame, resetScore } = useTicTacToe();

  const getCellClass = (value: string, index: number) => {
    const classes = ["board-cell"];
    if (value) classes.push("board-cell--filled");
    if (value === "X") classes.push("board-cell--x");
    if (value === "O") classes.push("board-cell--o");
    if (winningLine.includes(index)) classes.push("board-cell--winning");
    if (gameStatus !== "") classes.push("board-cell--disabled");
    return classes.join(" ");
  };

  return (
    <div style={{ minHeight: "100dvh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1rem", gap: "1.5rem" }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500, alignSelf: "flex-start" }}><IconArrowLeft size={18} />Back to Home</Link>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Play Offline</h1>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <div className="score-badge score-badge--x"><span className="score-badge__label">Player X</span><span className="score-badge__number">{xScore}</span></div>
        <div className="score-badge score-badge--o"><span className="score-badge__label">Player O</span><span className="score-badge__number">{oScore}</span></div>
      </div>
      <div style={{ position: "relative" }}>
        <div className="board-grid">
          {board.map((cell, index) => <button key={index} type="button" className={getCellClass(cell, index)} onClick={() => makeMove(index)} disabled={gameStatus !== "" || cell !== ""}>{cell && <span className="cell-symbol">{cell}</span>}</button>)}
        </div>
        {gameStatus !== "" && (
          <div className="result-overlay">
            <span className={`result-text ${gameStatus === "X" ? "result-text--x" : gameStatus === "O" ? "result-text--o" : "result-text--draw"}`}>{gameStatus === "draw" ? "Draw!" : `${gameStatus} Wins!`}</span>
            <button type="button" className="action-btn action-btn--accent" onClick={resetGame}><IconRefresh size={16} />Play Again</button>
          </div>
        )}
      </div>
      <div className="turn-indicator"><span className={`turn-dot ${currentPlayer === "X" ? "turn-dot--x" : "turn-dot--o"}`} /><span>Turn: Player {currentPlayer}</span></div>
      <div className="action-row">
        <button type="button" className="action-btn" onClick={resetGame}><IconRefresh size={16} />New Game</button>
        <button type="button" className="action-btn" onClick={resetScore}>Reset Score</button>
      </div>
    </div>
  );
}