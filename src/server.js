import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// Store the shared text value on the server
let sharedText = "";

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    // When a client requests the current text
    socket.on("get-text", () => {
      socket.emit("text-update", sharedText);
    });

    // When a client changes the text
    socket.on("text-change", (newText) => {
      sharedText = newText;
      // Broadcast to ALL clients (including sender for consistency)
      io.emit("text-update", newText);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
