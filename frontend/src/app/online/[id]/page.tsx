"use client";
import { useTicTacToe } from "@/hook/useTicTactoeOnline";
import { useSessionStorage } from "@/hook/useSessionStorage";
import { useSound } from "@/hook/useSound";
import { useState, use, useEffect, useRef } from "react";
import { useRoom } from "@/hook/useRoom";

type ChatMessageType = {
  from: string;
  message: string;
};

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function getWinningLine(board: string[]): number[] {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return [];
}

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { socket, sendChat } = useRoom(id);
  const [chatMessage, setChatMessage] = useState<ChatMessageType[]>([]);
  const [player, setPlayer] = useState<string>("");
  const { setValue, getValue } = useSessionStorage();
  const [sessionId, setSessionId] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const prevBoardRef = useRef<string[]>([]);
  const { playMove, playOpponentMove, playWin, playDraw } = useSound();

  useEffect(() => {
    socket.emit("playWithFriend", { roomId: id });

    function generateRandomName() {
      const random = crypto
        .getRandomValues(new Uint32Array(1))[0]
        .toString()
        .slice(0, 5);
      return `guest${random}`;
    }

    const name = getValue("ttt_name");
    if (!name) {
      const generated = generateRandomName();
      setValue("ttt_name", generated);
      setPlayer(generated);
    } else {
      setPlayer(getValue("ttt_name")!);
    }

    let sid = getValue("ttt_sessionId");
    if (!sid) {
      sid = crypto.randomUUID();
      setValue("ttt_sessionId", sid);
      setSessionId(sid);
    } else {
      setSessionId(getValue("ttt_sessionId")!);
    }

    socket.on("roomChatUpdate", (data: ChatMessageType) => {
      setChatMessage((prev) => [...prev, data]);
    });

    socket.on("resetScoreRoomClient", () => {
      resetScore();
    });

    return () => {
      socket.off("roomChatUpdate");
      socket.off("resetScoreRoomClient");
    };
  }, [id]);

  const {
    resetScore,
    resetGame,
    board,
    roleScore,
    gameCheckStatus,
    gameStatus,
    changeBoardPositionRole,
    role,
    turn,
  } = useTicTacToe(id, player, sessionId);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessage]);

  // Sound on board changes
  useEffect(() => {
    const prev = prevBoardRef.current;
    if (prev.length === 0) {
      prevBoardRef.current = [...board];
      return;
    }
    for (let i = 0; i < board.length; i++) {
      if (prev[i] !== board[i] && board[i] !== "") {
        if (board[i] === role) playMove();
        else playOpponentMove();
        break;
      }
    }
    prevBoardRef.current = [...board];
  }, [board]);

  // Sound on game end
  useEffect(() => {
    if (gameStatus === "draw") playDraw();
    else if (gameStatus === "X" || gameStatus === "O") playWin();
  }, [gameStatus]);

  // Check win/draw
  useEffect(() => {
    if (board.some((cell) => cell !== null && cell !== "")) {
      gameCheckStatus(board);
    }
  }, [board]);

  function handleRoomChat(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (!value) return;
      sendChat(player, value);
      e.currentTarget.value = "";
    }
  }

  const isGameOver = gameStatus !== "";
  const winningLine = isGameOver && gameStatus !== "draw" ? getWinningLine(board) : [];

  const resultText =
    gameStatus === "draw"
      ? "It's a Draw!"
      : gameStatus === role
        ? "You Win! 🎉"
        : gameStatus
          ? "You Lose!"
          : "";

  const resultClass =
    gameStatus === "draw"
      ? "result-text result-text--draw"
      : gameStatus === role
        ? `result-text result-text--${role?.toLowerCase()}`
        : "result-text result-text--draw";

  const isMyTurn = turn === role;

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "auto 1fr auto",
        padding: "4.5rem 1rem 1.5rem",
        gap: "1.25rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--text-secondary)",
            margin: 0,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Room · {id}
        </h1>
        {role && (
          <span className={`status-badge status-badge--${role.toLowerCase()}`}>
            You are {role}
          </span>
        )}
      </div>

      {/* Main content: chat | board | score */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.25rem",
          alignItems: "start",
        }}
        className="online-layout"
      >
        <style>{`
          @media (min-width: 900px) {
            .online-layout {
              grid-template-columns: 1fr auto 1fr !important;
              align-items: center !important;
            }
          }
        `}</style>

        {/* Chat panel */}
        <div
          className="panel"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "min(420px, 50dvh)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.75rem 1rem",
              borderBottom: "1px solid var(--border)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Chat
          </div>
          <div className="chat-messages">
            {chatMessage.length === 0 && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  textAlign: "center",
                  margin: "auto",
                }}
              >
                No messages yet
              </p>
            )}
            {chatMessage.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble ${msg.from === player ? "chat-bubble--own" : "chat-bubble--other"}`}
              >
                {msg.from !== player && (
                  <div className="chat-bubble__from">{msg.from}</div>
                )}
                {msg.message}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: "0.5rem", borderTop: "1px solid var(--border)" }}>
            <textarea
              ref={chatInputRef}
              onKeyDown={handleRoomChat}
              placeholder="Type a message, press Enter to send…"
              rows={2}
              style={{
                width: "100%",
                background: "var(--bg-cell)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                fontSize: "0.875rem",
                padding: "0.5rem 0.75rem",
                resize: "none",
                fontFamily: "inherit",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            />
          </div>
        </div>

        {/* Board */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div style={{ position: "relative", width: "min(340px, 90vw)" }}>
            <div
              className="board-grid"
              style={{ width: "100%", aspectRatio: "1" }}
            >
              {board.map((cellRole, index) => {
                const isMine = turn === role && !cellRole && !isGameOver;
                return (
                  <div
                    key={index}
                    onClick={() => isMine ? changeBoardPositionRole(index) : undefined}
                    className={[
                      "board-cell",
                      cellRole ? "board-cell--filled" : "",
                      cellRole === "X" ? "board-cell--x" : "",
                      cellRole === "O" ? "board-cell--o" : "",
                      !isMine && !cellRole ? "board-cell--disabled" : "",
                      winningLine.includes(index)
                        ? cellRole === "X"
                          ? "board-cell--winning board-cell--x"
                          : "board-cell--winning board-cell--o"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {cellRole && (
                      <span className="cell-symbol">{cellRole}</span>
                    )}
                  </div>
                );
              })}
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

          {/* Turn indicator */}
          {!isGameOver && role && (
            <div className="turn-indicator">
              {isMyTurn ? (
                <>
                  <span className={`turn-dot turn-dot--${role.toLowerCase()}`} />
                  <span>
                    Your turn &mdash;{" "}
                    <strong
                      style={{
                        color:
                          role === "X" ? "var(--x-color)" : "var(--o-color)",
                      }}
                    >
                      {role}
                    </strong>
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="turn-dot"
                    style={{ background: "var(--text-muted)", animationPlayState: "paused" }}
                  />
                  <span style={{ color: "var(--text-muted)" }}>
                    Waiting for opponent…
                  </span>
                </>
              )}
            </div>
          )}

          {!role && (
            <div className="turn-indicator">
              <span className="turn-dot" />
              <span style={{ color: "var(--text-muted)" }}>
                Waiting for opponent to join…
              </span>
            </div>
          )}
        </div>

        {/* Score panel */}
        <div
          className="panel"
          style={{
            padding: "1.5rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "0.5rem",
            }}
          >
            Scoreboard
          </div>

          {/* Opponent score */}
          <div
            className={`score-badge score-badge--${role === "X" ? "o" : "x"}`}
            style={{ width: "100%", maxWidth: "180px", alignItems: "center" }}
          >
            <span className="score-badge__label">
              Opponent ({role === "X" ? "O" : "X"})
            </span>
            <span className="score-badge__number">
              {role === "X" ? roleScore.oScore : roleScore.xScore}
            </span>
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: "180px",
              height: "1px",
              background: "var(--border)",
            }}
          />

          {/* My score */}
          <div
            className={`score-badge score-badge--${role?.toLowerCase() ?? "x"}`}
            style={{ width: "100%", maxWidth: "180px", alignItems: "center" }}
          >
            <span className="score-badge__label">
              You ({role ?? "–"})
            </span>
            <span className="score-badge__number">
              {role === "X" ? roleScore.xScore : roleScore.oScore}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
