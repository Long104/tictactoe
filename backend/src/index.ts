import { Server as Engine } from "@socket.io/bun-engine";
import { Server, Socket } from "socket.io";
import { Hono } from "hono";
import { cors } from "hono/cors";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "local" ? ".env.local" : ".env",
});

const io = new Server({
  cors: {
    origin: process.env.BACKEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io/", // ✅ Explicit path
  transports: ["websocket", "polling"],
});

const engine = new Engine();

io.bind(engine);

const rooms = new Map<
  string,
  {
    player1?: { socketId: string; name: string; role: string };
    player2?: { socketId: string; name: string; role: string };
    board: string[];
    gameStarted: boolean;
  }
>();

const socketToRoom = new Map<string, string>();

io.on("connection", (socket) => {
  socket.on("setPlayerName", (name: string) => {
    socket.data.name = name;
  });

  socket.on("openChatBroadcast", (value) => {
    socket.broadcast.emit("openChatUpdate", value);
  });

  socket.on("waitingRoom", async (data) => {
    const { roomId } = data;
    const sockets = await io.in(`room${roomId}`).fetchSockets();
    const roomSize = sockets.length;
    const currentRoom = rooms.get(roomId);
    // Check if this socket was already in the room (reconnection)
    const existingPlayer = getExistingPlayer(currentRoom, socket.id);
    if (existingPlayer) {
      // Returning player - restore their role
      socket.emit("roleRestored", {
        role: existingPlayer.role,
      });
      return;
    }
    if (roomSize === 1) {
      // First player - waiting
      socket.emit("waiting", "Waiting for opponent...");
    } else if (roomSize === 2) {
      // Second player - start game!
      const [player1, player2] = sockets;
      // Only assign roles if game hasn't started
      if (!currentRoom?.gameStarted) {
        const roles =
          Math.random() < 0.5
            ? [
                { turn: "your turn", role: "X" },
                { turn: "opponent turn", role: "O" },
              ]
            : [
                { turn: "opponent turn", role: "X" },
                { turn: "your turn", role: "O" },
              ];
        // Store roles in rooms map
        rooms.set(roomId, {
          player1: {
            socketId: player1.id,
            name: player1.data.name || "Player 1",
            role: roles[0].role,
          },
          player2: {
            socketId: player2.id,
            name: player2.data.name || "Player 2",
            role: roles[1].role,
          },
          board: ["", "", "", "", "", "", "", "", ""],
          gameStarted: true,
        });
        // Track which room each socket is in
        socketToRoom.set(player1.id, roomId);
        socketToRoom.set(player2.id, roomId);
        player1.emit("waitForOpponent", roles[0]);
        player2.emit("waitForOpponent", roles[1]);
      }
    } else {
      // Room is full
      socket.emit("error", { message: "Room is full" });
      socket.leave(`room${roomId}`);
    }
  });

  socket.on("joinRoom", async (roomId) => {
    socket.join(`room${roomId}`);
  });

  socket.on("roomMove", async (data) => {
    const { position, currentMovePlayer, role, roomId, board, turn, player } =
      data;
    // const sockets = await io.in(`room${roomId}`).fetchSockets();
    // const [player1, player2] = sockets;

    // rooms.set(roomId, { board: board });

    io.to(`room${roomId}`).emit("roomMoveUpdate", {
      position,
      currentMovePlayer,
      turn,
      board: rooms.get(roomId),
      role,
      player,
    });
  });

  socket.on(
    "roomChatBroadcast",
    (value: { roomId: string; from: string; message: string }) => {
      const { roomId, from, message } = value;
      io.to(`room${roomId}`).emit("roomChatUpdate", {
        from,
        message,
      });
    },
  );

  socket.on("disconnect", () => {
    const roomId = socketToRoom.get(socket.id);
    if (roomId) {
      socketToRoom.delete(socket.id);
    }
  });
});

function getExistingPlayer(room: any, socketId: string) {
  if (!room) return null;

  if (room.player1?.socketId === socketId) return room.player1;
  if (room.player2?.socketId === socketId) return room.player2;

  return null;
}

const app = new Hono();
app.use(
  "*",
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "tictactoe-gamma-dusky-67.vercel.app"
        : "http://localhost:3000",

    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600,
  }),
);

app.get("/", (c) => c.text("Hono!"));

const { websocket } = engine.handler();

export default {
  port: 8000,
  idleTimeout: 30, // must be greater than the "pingInterval" option of the engine, which defaults to 25 seconds

  fetch(req: Request, server: Bun.Server<any>): Response | Promise<Response> {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin":
            process.env.BACKEND_URL ?? "localhost:3000",
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
