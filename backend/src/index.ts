import { Server as Engine } from "@socket.io/bun-engine";
import { Server } from "socket.io";
import { Hono } from "hono";
import { cors } from "hono/cors";
import dotenv from "dotenv";

import { InMemoryPlayerRepository } from "./infrastructure/persistence/InMemoryPlayerRepository";
import { InMemoryRoomRepository } from "./infrastructure/persistence/InMemoryRoomRepository";
import { SocketIOGateway } from "./infrastructure/socket/SocketIOGateway";
import { SocketHandler } from "./presentation/socket/SocketHandler";

dotenv.config({
  path: process.env.NODE_ENV === "local" ? ".env.local" : ".env",
});

const io = new Server({
  cors: {
    origin: process.env.BACKEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io/",
  transports: ["websocket", "polling"],
});

const engine = new Engine();
io.bind(engine);

const playerRepository = new InMemoryPlayerRepository();
const roomRepository = new InMemoryRoomRepository();
const notificationGateway = new SocketIOGateway(io);
const socketHandler = new SocketHandler(io, playerRepository, roomRepository, notificationGateway);

io.on("connection", (socket) => {
  socketHandler.handleConnection(socket);
});

const app = new Hono();
app.use(
  "*",
  cors({
    origin: process.env.BACKEND_URL ?? "http://localhost:3000",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600,
  })
);

app.get("/", (c) => c.text("Tic-Tac-Toe API - Clean Architecture"));

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

    if (url.pathname === "/socket.io/") {
      return engine.handleRequest(req, server);
    } else {
      return app.fetch(req, server);
    }
  },

  websocket,
};