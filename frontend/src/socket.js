import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production"
    ? "https://tictactoe-0sye.onrender.com"
    : "http://localhost:8000";

export const socket = io(URL, {
  transports: ["websocket", "polling"],
  withCredentials: true, // matches server credentials
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
