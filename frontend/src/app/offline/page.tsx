"use client";
import { useTicTacToe } from "../../hook/useTicTacToe";
import { useSound } from "../../hook/useSound";

const Page = () => {
  const {
    board,
    currentPlayer,
    gameStatus,
    winningLine,
    xScore,
    oScore,
    makeMove,
    resetGame,
    resetScore,
  } = useTicTacToe();

  const { playMove, playWin, playDraw } = useSound();

  function handleCellClick(index: number) {
    if (board[index] !== "" || gameStatus !== "") return;
    const result = makeMove(index);
    if (!result) return;
    if (result.event === "win") playWin();
    else if (result.event === "draw") playDraw();
    else playMove();
  }

  const isGameOver = gameStatus !== "";

  const resultText =
    gameStatus === "draw"
      ? "It's a Draw!"
      : gameStatus
        ? `${gameStatus} Wins!`
        : "";

  const resultClass =
    gameStatus === "draw"
      ? "result-text result-text--draw"
      : gameStatus === "X"
        ? "result-text result-text--x"
        : "result-text result-text--o";

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1rem 2rem",
        gap: "1.5rem",
      }}
    >
      {/* Title */}
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Offline Game
        </h1>
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            margin: "0.25rem 0 0",
          }}
        >
          Player 1 is X • Player 2 is O
        </p>
      </div>

      {/* Main layout: scores + board + scores */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          maxWidth: "680px",
        }}
      >
        {/* X Score */}
        <div className="score-badge score-badge--x" style={{ minWidth: "80px" }}>
          <span className="score-badge__label">Player X</span>
          <span className="score-badge__number">{xScore}</span>
        </div>

        {/* Board */}
        <div style={{ position: "relative", flex: "1", maxWidth: "420px", minWidth: "260px" }}>
          <div
            className="board-grid"
            style={{
              width: "100%",
              aspectRatio: "1",
            }}
          >
            {board.map((cell, index) => (
              <div
                key={index}
                onClick={() => handleCellClick(index)}
                className={[
                  "board-cell",
                  cell ? "board-cell--filled" : "",
                  cell === "X" ? "board-cell--x" : "",
                  cell === "O" ? "board-cell--o" : "",
                  isGameOver && !winningLine.includes(index) ? "board-cell--disabled" : "",
                  winningLine.includes(index)
                    ? cell === "X"
                      ? "board-cell--winning board-cell--x"
                      : "board-cell--winning board-cell--o"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {cell && <span className="cell-symbol">{cell}</span>}
              </div>
            ))}
          </div>

          {/* Result Overlay */}
          {isGameOver && (
            <div className="result-overlay">
              <span className={resultClass}>{resultText}</span>
              <div className="action-row" style={{ justifyContent: "center" }}>
                <button
                  className="action-btn action-btn--accent"
                  onClick={resetGame}
                >
                  Play Again
                </button>
                <button className="action-btn" onClick={resetScore}>
                  Reset Score
                </button>
              </div>
            </div>
          )}
        </div>

        {/* O Score */}
        <div className="score-badge score-badge--o" style={{ minWidth: "80px" }}>
          <span className="score-badge__label">Player O</span>
          <span className="score-badge__number">{oScore}</span>
        </div>
      </div>

      {/* Turn indicator */}
      {!isGameOver && (
        <div className="turn-indicator">
          <span
            className={`turn-dot turn-dot--${currentPlayer.toLowerCase()}`}
          />
          <span>
            Player{" "}
            <strong
              style={{
                color:
                  currentPlayer === "X"
                    ? "var(--x-color)"
                    : "var(--o-color)",
              }}
            >
              {currentPlayer}
            </strong>
            {"'s turn"}
          </span>
        </div>
      )}
    </div>
  );
};

export default Page;
