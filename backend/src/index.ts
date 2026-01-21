import { Server as Engine } from "@socket.io/bun-engine";
import { Server, Socket } from "socket.io";
import { Hono } from "hono";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import { PlayerState, RoomState } from "./type";
import {
  rooms,
  players,
  roomPlayers,
  addPlayerToRoom,
  createRoom,
  getPlayerBySocketId,
  getPlayersInRoom,
  getRoom,
  getPlayerBySessionId,
  sessionBySocket,
} from "./state_management";

const waitingPlayers = new Map<string, Socket>();
const roomCreate = new Map<
  string,
  { socket: Socket; roomName: string; player: string; roomId: string }
>();
const playWithFriend = new Map<string, Socket>();

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

io.on("connection", (socket) => {
  socket.on("setPlayerName", (data: { name: string; sessionId: string }) => {
    const { name, sessionId } = data;
    socket.data.name = name;
    socket.data.sessionId = sessionId;
  });

  socket.on("joinRoom", (data: { roomId: string }) => {
    const { roomId } = data;
    socket.join(`room${roomId}`);
  });

  socket.on("playWithFriend", (data: { roomId: string }) => {
    const { roomId } = data;

    const existingPlayer = playWithFriend.get(roomId);
    if (existingPlayer) {
      socket.join(`room${roomId}`);
      existingPlayer.join(`room${roomId}`);
      io.to(`room${roomId}`).emit("findRoom", { id: roomId });
      return;
    }
    playWithFriend.set(roomId, socket);
  });

  socket.on("createRoom", (data: { roomName: string; player: string }) => {
    const { roomName, player } = data;
    const roomId = crypto.randomUUID().slice(0, 7);
    roomCreate.set(roomId, { socket, roomName, player, roomId });

    const entry = roomCreate.entries();
    let roomNames: { roomName: string; player: string; roomId: string }[] = [];
    for (const [_, b] of entry) {
      roomNames.push({ roomName: b.roomName, player: b.player, roomId });
    }
    io.emit("dashboard", roomNames);
  });

  socket.on("getDashboard", () => {
    const entry = roomCreate.entries();
    let roomNames: { roomName: string; player: string; roomId: string }[] = [];
    for (const [_, b] of entry) {
      roomNames.push({
        roomName: b.roomName,
        player: b.player,
        roomId: b.roomId,
      });
    }
    io.emit("dashboard", roomNames);
  });

  socket.on("chooseRoom", (data: { roomId: string }) => {
    const { roomId } = data;
    const playerThatCreateRoom = roomCreate.get(roomId);

    if (playerThatCreateRoom?.socket.id === socket.id) return;

    if (playerThatCreateRoom) {
      socket.join(roomId);
      playerThatCreateRoom.socket.join(roomId);
      io.to(roomId).emit("findRoom", { id: roomId });
      roomCreate.delete(roomId);
    }
  });

  socket.on("searchRoom", () => {
    const entry = waitingPlayers.entries().next().value;

    if (entry) {
      const [waitingSocketId, waitingSocket] = entry;

      if (waitingSocketId === socket.id) return;

      waitingPlayers.delete(waitingSocketId);

      const roomId = crypto.randomUUID().slice(0, 7);

      socket.join(roomId);
      waitingSocket.join(roomId);

      io.to(roomId).emit("findRoom", { id: roomId });
    } else {
      waitingPlayers.set(socket.id, socket);
    }
  });

  socket.on(
    "waitingRoom",
    async (data: { sessionId: string; roomId: string }) => {
      const { roomId, sessionId } = data;

      const existingPlayer = getPlayerBySessionId(sessionId);

      if (existingPlayer && existingPlayer.roomId === roomId) {
        const room = getRoom(roomId);

        if (room) {
          existingPlayer.socketId = socket.id;

          sessionBySocket.set(socket.id, sessionId);

          socket.emit("roleRestored", {
            role: existingPlayer.role,
            board: room.board,
            currentTurn: room.currentTurn,
            playerName: existingPlayer.name,
            score: room.score,
          });

          socket.join(`room${roomId}`);
          addPlayerToRoom(existingPlayer);

          // roomPlayers.get("1")?.add("hello");
          // console.log(socket.id);
          // const sockets = await io.in(`room${roomId}`).fetchSockets();
          return;
        }
      }

      // new player join
      const sockets = await io.in(`room${roomId}`).fetchSockets();
      const playersInRoom = getPlayersInRoom(roomId);
      const roomSize = playersInRoom.length;

      if (roomSize === 0) {
        console.log("roomSize == 0");
        // first player create room
        createRoom(roomId);

        // create new player with session Id
        const newPlayer: PlayerState = {
          sessionId: sessionId,
          socketId: socket.id,
          name: socket.data.name || "Player 1",
          role: "X",
          roomId,
          joinedAt: Date.now(),
        };

        players.set(sessionId, newPlayer);
        sessionBySocket.set(socket.id, sessionId);
        addPlayerToRoom(newPlayer);
        socket.join(`room${roomId}`);

        console.log("room Player:", roomPlayers);
        console.log("players: ", players);
        console.log("rooms:", rooms);
        console.log("session by socket:", sessionBySocket);
        socket.emit("waiting", "Waiting for opponent...");
      } else if (roomSize === 1) {
        console.log("roomSize == 1");
        // if second player - start game

        // check if there are people in the session and if they are disconnect
        const playerSessionIds = roomPlayers.get(roomId);
        if (!playerSessionIds || playerSessionIds.size === 0) {
          socket.emit("error", { message: "Invalid room state" });
          return;
        }

        // get the existing player first one
        const player1SessionId = Array.from(playerSessionIds)[0];
        const existingPlayer1 = getPlayerBySessionId(player1SessionId);
        console.log("check exisint player");
        console.log("player1sessionId", player1SessionId);
        console.log("exiting player", existingPlayer1);
        console.log("room Player:", roomPlayers);
        console.log("players: ", players);
        console.log("rooms:", rooms);
        console.log("session by socket:", sessionBySocket);

        if (!existingPlayer1) {
          socket.emit("error", { message: "player not found" });
          return;
        }

        // check the actual socket for player 1 if it exist
        const player1Socket = io.sockets.sockets.get(existingPlayer1.socketId);
        if (!player1Socket) {
          socket.emit("error", { message: "player 1 disconnected" });
          return;
        }

        // const [player1Socket] = sockets;
        // const existingPlayer1 = getPlayerBySocketId(player1Socket.id);
        // if (!existingPlayer1) {
        //   socket.emit("error", { message: "Invalid room state" });
        //   return;
        // }

        const newPlayer: PlayerState = {
          socketId: socket.id,
          sessionId,
          name: socket.data.name || "Player 2",
          role: existingPlayer1.role === "X" ? "O" : "X",
          roomId,
          joinedAt: Date.now(),
        };

        players.set(sessionId, newPlayer);
        sessionBySocket.set(socket.id, sessionId);
        addPlayerToRoom(newPlayer);
        socket.join(`room${roomId}`);

        // update room state
        const room = getRoom(roomId);
        if (room) {
          room.gameStarted = true;
          room.currentTurn = "X";
        }

        // send role assignments
        const player1Role = existingPlayer1.role;
        const player2Role = newPlayer.role;

        player1Socket.emit("waitForOpponent", {
          role: player1Role,
          currentTurn: "X",
        });

        socket.emit("waitForOpponent", {
          role: player2Role,
          currentTurn: "X",
        });

        console.log("room Player:", roomPlayers);
        console.log("players: ", players);
        console.log("rooms:", rooms);
        console.log("session by socket:", sessionBySocket);
      } else {
        // room full
        socket.emit("error", { message: "Room is full" });
        socket.leave(`room${roomId}`);
      }
    },
  );

  socket.on(
    "roomMove",
    async (data: {
      position: number;
      currentMovePlayer: string;
      role: "X" | "O";
      roomId: string;
      board: string[];
      turn: string;
      score: { xScore: number; oScore: number };
    }) => {
      const { position, role, roomId, board, turn, score } = data;
      const player = getPlayerBySocketId(socket.id);
      console.log("check invalid player");
      console.log("room Player:", roomPlayers);
      console.log("players: ", players);
      console.log("rooms:", rooms);
      console.log("session by socket:", sessionBySocket);

      if (!player || player.roomId !== roomId) {
        socket.emit("error", { message: "Invalid player" });
        return;
      }

      if (player.role !== role) {
        socket.emit("error", { message: "Invalide role" });
        return;
      }

      const room = getRoom(roomId);
      if (room) {
        room.board = board;
        room.currentTurn = turn as "X" | "O";

        io.to(`room${roomId}`).emit("roomMoveUpdate", {
          position,
          currentMovePLayer: player.name,
          turn,
          board: room.board,
          role,
          score,
        });

        console.log(`move in room ${roomId}: ${role} at position ${position}`);
      }
    },
  );

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

  socket.on("openChatBroadcast", (value) => {
    socket.broadcast.emit("openChatUpdate", value);
  });

  socket.on("disconnect", () => {
    console.log(`client disconnected: ${socket.id}`);
    const player = getPlayerBySocketId(socket.id);
    waitingPlayers.delete(socket.id);
    roomCreate.delete(socket.id);
    if (!player) return;
    const roomId = player.roomId;
    const sessionId = player.sessionId;
    setTimeout(async () => {
      const sockets = await io.in(`room${player.roomId}`).fetchSockets();
      if (sockets.length === 0) {
        rooms.delete(roomId);
        roomPlayers.delete(roomId); // Already deleted above, but keep for safety
        players.delete(sessionId);
        sessionBySocket.delete(socket.id);
      }
    }, 3000);
  });
});

const app = new Hono();
app.use(
  "*",
  cors({
    origin: process.env.BACKEND_URL ?? "localhost:3000",
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
