import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const socket = io(URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});
