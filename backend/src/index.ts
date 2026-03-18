import { Server as Engine } from "@socket.io/bun-engine";
import { Server } from "socket.io";
import { Hono } from "hono";
import { cors } from "hono/cors";
import dotenv from "dotenv";

import { GameService } from "./application/GameService";
import { InMemoryGameAdapter } from "./adapters/secondary/InMemoryGameAdapter";
import { SocketIOAdapter } from "./adapters/primary/SocketIOAdapter";

dotenv.config({ path: process.env.NODE_ENV === "local" ? ".env.local" : ".env" });

const io = new Server({
  cors: { origin: process.env.BACKEND_URL, methods: ["GET", "POST"], credentials: true },
  path: "/socket.io/",
  transports: ["websocket", "polling"],
});

const engine = new Engine();
io.bind(engine);

const gameStateAdapter = new InMemoryGameAdapter();
const notificationAdapter = new SocketIOAdapter(io);
const gameService = new GameService(gameStateAdapter, notificationAdapter);

const waitingRooms = new Map<string, { socket: any; roomName: string; player: string; roomId: string }>();
const playWithFriends = new Map<string, any>();

io.on("connection", (socket: any) => {
  socket.on("setPlayerName", (data: { name: string; sessionId: string }) => { socket.data.name = data.name; socket.data.sessionId = data.sessionId; });
  socket.on("createRoom", (data: { roomName: string; player: string }) => {
    const result = gameService.createRoom({ roomName: data.roomName, hostName: data.player, sessionId: socket.data.sessionId, socketId: socket.id });
    waitingRooms.set(result.roomId, { socket, roomName: data.roomName, player: data.player, roomId: result.roomId });
    io.emit("dashboard", Array.from(waitingRooms.values()).map(r => ({ roomName: r.roomName, player: r.player, roomId: r.roomId })));
  });
  socket.on("getDashboard", () => { io.emit("dashboard", Array.from(waitingRooms.values()).map(r => ({ roomName: r.roomName, player: r.player, roomId: r.roomId }))); });
  socket.on("chooseRoom", (data: { roomId: string }) => {
    const room = waitingRooms.get(data.roomId);
    if (!room || room.socket.id === socket.id) return;
    socket.join(`room${data.roomId}`);
    room.socket.join(`room${data.roomId}`);
    const joinResult = gameService.joinRoom({ sessionId: socket.data.sessionId, socketId: socket.id, name: socket.data.name || "Player 2", roomId: data.roomId });
    if (joinResult.success && joinResult.gameStarted) io.to(`room${data.roomId}`).emit("findRoom", { id: data.roomId });
    waitingRooms.delete(data.roomId);
    updateDashboard();
  });
  socket.on("searchRoom", () => {
    const result = gameService.searchOpponent({ sessionId: socket.data.sessionId, socketId: socket.id, name: socket.data.name || "Player" });
    if (result.roomId) socket.emit("findRoom", { id: result.roomId });
    else socket.emit("waiting", result.message);
  });
  socket.on("playWithFriend", (data: { roomId: string }) => {
    const existing = playWithFriends.get(data.roomId);
    if (existing?.id === socket.id) return;
    if (existing) {
      socket.join(`room${data.roomId}`);
      existing.join(`room${data.roomId}`);
      gameService.createRoom({ roomName: "Play with Friend", hostName: socket.data.name || "Host", sessionId: socket.data.sessionId, socketId: socket.id });
      gameService.joinRoom({ sessionId: existing.data.sessionId, socketId: existing.id, name: existing.data.name || "Player 2", roomId: data.roomId });
      io.to(`room${data.roomId}`).emit("findRoom", { id: data.roomId });
      playWithFriends.delete(data.roomId);
    } else { playWithFriends.set(data.roomId, socket); }
  });
  socket.on("joinRoom", (data: { roomId: string }) => { socket.join(`room${data.roomId}`); });
  socket.on("waitingRoom", (data: { sessionId: string; roomId: string }) => {
    socket.data.sessionId = data.sessionId;
    const result = gameService.joinRoom({ sessionId: data.sessionId, socketId: socket.id, name: socket.data.name || "Player", roomId: data.roomId });
    if (result.success) {
      socket.join(`room${data.roomId}`);
      if (result.gameStarted) socket.emit("waitForOpponent", { role: result.player?.role, currentTurn: "X" });
      else socket.emit("waiting", "Waiting for opponent...");
    } else { socket.emit("error", { message: result.message }); }
  });
  socket.on("roomMove", (data: any) => { gameService.makeMove({ sessionId: socket.data.sessionId, roomId: data.roomId, position: data.position, role: data.role }); });
  socket.on("roomChatBroadcast", (data: { roomId: string; from: string; message: string }) => { gameService.sendChat({ sessionId: socket.data.sessionId, roomId: data.roomId, message: data.message }); });
  socket.on("resetScore", (data: { roomId: string }) => { gameService.resetScore({ roomId: data.roomId, sessionId: socket.data.sessionId }); });
  socket.on("openChatBroadcast", (data: { from: string; message: string }) => { io.emit("openChatUpdate", data); });
  socket.on("disconnect", () => {
    waitingRooms.forEach((room, roomId) => { if (room.socket.id === socket.id) waitingRooms.delete(roomId); });
    playWithFriends.forEach((s, roomId) => { if (s.id === socket.id) playWithFriends.delete(roomId); });
    gameService.cancelSearch(socket.id);
    updateDashboard();
  });
});

function updateDashboard() { io.emit("dashboard", Array.from(waitingRooms.values()).map(r => ({ roomName: r.roomName, player: r.player, roomId: r.roomId }))); }

const app = new Hono();
app.use("*", cors({ origin: process.env.BACKEND_URL ?? "http://localhost:3000", allowMethods: ["GET", "POST", "OPTIONS"], allowHeaders: ["Content-Type", "Authorization"], credentials: true, maxAge: 600 }));
app.get("/", (c) => c.text("Tic-Tac-Toe API - Hexagonal Architecture"));

const { websocket } = engine.handler();

export default {
  port: 8000,
  idleTimeout: 30,
  fetch(req: Request, server: Bun.Server<any>): Response | Promise<Response> {
    const url = new URL(req.url);
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": process.env.BACKEND_URL ?? "http://localhost:3000",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "600",
        },
      });
    }
    if (url.pathname === "/socket.io/") return engine.handleRequest(req, server);
    return app.fetch(req, server);
  },
  websocket,
};