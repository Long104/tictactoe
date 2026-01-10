import { Server as Engine } from "@socket.io/bun-engine";
import { Server } from "socket.io";
import { Hono } from "hono";
import { cors } from "hono/cors";

const io = new Server({
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "tictactoe-gamma-dusky-67.vercel.app"
        : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const shareValue = "";

const engine = new Engine();

io.bind(engine);

io.on("connection", (socket) => {
  // ...
  socket.on("create-something", (value) => {
    // io.emit("foo", value);
    socket.broadcast.emit("foo", value);
  });

  socket.on("openChatBroadcast", (value) => {
    socket.broadcast.emit("openChat", value);
  });
});

const app = new Hono();
app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
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

    if (url.pathname === "/socket.io/") {
      return engine.handleRequest(req, server);
    } else {
      return app.fetch(req, server);
    }
  },

  websocket,
};
