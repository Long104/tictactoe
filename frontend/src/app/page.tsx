"use client";
import { Modal, TextInput } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { SocketAdapter, SessionStorageAdapter } from "@/infrastructure";
import { useDisclosure } from "@mantine/hooks";
import QRCode from "react-qrcode-logo";
import { IconWorld, IconDeviceGamepad2, IconUsers, IconPlus, IconCopy, IconCheck, IconDoor, IconMessageCircle } from "@tabler/icons-react";

const socket = new SocketAdapter();
const storage = new SessionStorageAdapter();

type OpenChatMessageType = { from: string; message: string };

export default function HomePage() {
  const [openChatMessage, setOpenChatMessage] = useState<OpenChatMessageType[]>();
  const [player, setPlayer] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const router = require("next/navigation").useRouter();
  const [dashboardRoom, setDashboardRoom] = useState<{ player: string; roomName: string; roomId: string }[]>([]);
  const [playWithFriendRoomId, setPlayWithFriendRoomId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [openedCreateRoom, { open: openCreateRoom, close: closeCreateRoom }] = useDisclosure(false);
  const [openedPlayWithFriend, { open: openPlayWithFriend, close: closePlayWithFriend }] = useDisclosure(false);

  function handleOpenChat(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (!value) return;
      setOpenChatMessage((prev) => [...(prev || []), { from: player!, message: value }]);
      socket.emit("openChatBroadcast", { from: player, message: value });
      e.currentTarget.value = "";
    }
  }

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [openChatMessage]);

  useEffect(() => {
    socket.connect();
    function findRoom(data: { id: number }) { router.push(`/online/${data.id}`); }
    function generateRandomName() { return `guest${crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(0, 5)}`; }

    const name = storage.get<string>("ttt_name");
    if (!name) { const generated = generateRandomName(); storage.set("ttt_name", generated); setPlayer(generated); }
    else { setPlayer(name); }

    let sessionId = storage.get<string>("ttt_sessionId");
    if (!sessionId) { sessionId = crypto.randomUUID(); storage.set("ttt_sessionId", sessionId); }

    socket.on("openChatUpdate", (value) => { setOpenChatMessage((prev) => [...(prev || []), value as any]); });
    socket.on("findRoom", findRoom);
    socket.on("dashboard", (value) => { setDashboardRoom(value); });
    socket.emit("getDashboard");

    return () => { socket.off("openChatUpdate"); socket.off("findRoom"); socket.off("dashboard"); };
  }, []);

  function handleChooseRoom(roomId: string) { socket.emit("chooseRoom", { roomId }); }
  function handlePlayWithFriend() { const roomId = crypto.randomUUID().slice(0, 7); setPlayWithFriendRoomId(roomId); openPlayWithFriend(); }
  function createRoom() { const sessionId = storage.get<string>("ttt_sessionId") || crypto.randomUUID(); storage.set("ttt_sessionId", sessionId); socket.emit("createRoom", { roomName, player }); closeCreateRoom(); }
  function copyLink() { const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/online/${playWithFriendRoomId}`; navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }

  const friendUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/online/${playWithFriendRoomId}`;

  return (
    <>
      <Modal opened={openedCreateRoom} onClose={closeCreateRoom} title="Create a Room">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <TextInput label="Room Name" placeholder="My Epic Room" onChange={(e) => setRoomName(e.currentTarget.value)} />
          <button type="button" className="game-btn game-btn--primary" onClick={createRoom}><IconPlus size={18} />Create Room</button>
        </div>
      </Modal>

      <Modal opened={openedPlayWithFriend} onClose={closePlayWithFriend} title="Invite a Friend">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-cell)", border: "1px solid var(--border)", borderRadius: "10px", padding: "0.5rem 0.75rem", fontSize: "0.8rem", color: "var(--text-secondary)", wordBreak: "break-all" }}>
            <span style={{ flex: 1 }}>{friendUrl}</span>
            <button type="button" onClick={copyLink} style={{ padding: "0.35rem 0.6rem", borderRadius: "8px", border: "1px solid var(--border)", background: copied ? "var(--accent-dim)" : "var(--bg-panel)", color: copied ? "var(--accent)" : "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", fontWeight: 600 }}>{copied ? <IconCheck size={14} /> : <IconCopy size={14} />}{copied ? "Copied!" : "Copy"}</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 200, height: 200, borderRadius: 12, overflow: "hidden", background: "#fff", padding: "8px" }}><QRCode value={friendUrl} size={184} bgColor="#ffffff" fgColor="#0d0f14" ecLevel="H" qrStyle="dots" /></div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>Scan to join the room</p>
          </div>
          <Link href={friendUrl} style={{ textDecoration: "none" }}><button type="button" className="game-btn game-btn--primary" style={{ width: "100%" }}><IconDoor size={18} />Go to Room</button></Link>
        </div>
      </Modal>

      <div style={{ minHeight: "100dvh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "3rem 1rem 2rem", gap: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>Tic-Tac-Toe</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Signed in as <strong style={{ color: "var(--accent)" }}>{player || "…"}</strong></p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem", width: "100%", maxWidth: "1100px" }} className="home-layout">
          <style>{`@media (min-width: 700px) { .home-layout { grid-template-columns: 1fr 1fr 1fr !important; } }`}</style>
          <div className="panel" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>Play</div>
            <button type="button" className="game-btn game-btn--primary" onClick={() => socket.emit("searchRoom")}><IconWorld size={20} />Play Online</button>
            <Link href="/offline" style={{ textDecoration: "none" }}><button type="button" className="game-btn" style={{ width: "100%" }}><IconDeviceGamepad2 size={20} />Play Offline</button></Link>
            <button type="button" className="game-btn" onClick={handlePlayWithFriend}><IconUsers size={20} />Play with Friend</button>
            <button type="button" className="game-btn" onClick={openCreateRoom}><IconPlus size={20} />Create Room</button>
          </div>
          <div className="panel" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center" }}><span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", flex: 1 }}>Open Rooms</span>{dashboardRoom.length > 0 && <span className="join-pill">{dashboardRoom.length} open</span>}</div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {dashboardRoom.length === 0 ? <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "1.5rem" }}>No open rooms right now</p> : (
                <table className="dashboard-table"><thead><tr><th>Room</th><th>Host</th><th></th></tr></thead><tbody>{dashboardRoom.map((d, i) => <tr key={i} onClick={() => handleChooseRoom(d.roomId)} style={{ cursor: "pointer" }}><td>{d.roomName}</td><td>{d.player}</td><td><span className="join-pill">Join</span></td></tr>)}</tbody></table>
              )}
            </div>
          </div>
          <div className="panel" style={{ display: "flex", flexDirection: "column", overflow: "hidden", minHeight: "300px" }}>
            <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}><IconMessageCircle size={14} />Global Chat</div>
            <div className="chat-messages" style={{ flex: 1 }}>
              {!openChatMessage || openChatMessage.length === 0 ? <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", margin: "auto" }}>Start the conversation…</p> : openChatMessage.map((msg, index) => <div key={index} className={`chat-bubble ${msg.from === player ? "chat-bubble--own" : "chat-bubble--other"}`}>{msg.from !== player && <div className="chat-bubble__from">{msg.from}</div>}{msg.message}</div>)}
              <div ref={chatEndRef} />
            </div>
            <div style={{ padding: "0.5rem", borderTop: "1px solid var(--border)" }}>
              <textarea onKeyDown={handleOpenChat} placeholder="Chat with everyone…" rows={2} style={{ width: "100%", background: "var(--bg-cell)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "0.875rem", padding: "0.5rem 0.75rem", resize: "none", outline: "none" }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}