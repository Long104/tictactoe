import { io, Socket } from "socket.io-client";
import { SocketPort } from "../../ports/outbound";

export class SocketIOAdapter implements SocketPort {
  private socket: Socket;

  constructor(url?: string) {
    this.socket = io(url || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000", {
      path: "/socket.io/",
      transports: ["websocket", "polling"],
      autoConnect: false,
    });
  }

  connect(): void { if (!this.socket.connected) this.socket.connect(); }
  disconnect(): void { if (this.socket.connected) this.socket.disconnect(); }
  emit(event: string, data: unknown): void { this.socket.emit(event, data); }
  on(event: string, callback: (data: unknown) => void): void { this.socket.on(event, callback); }
  off(event: string, callback?: (data: unknown) => void): void { if (callback) this.socket.off(event, callback); else this.socket.off(event); }
  getSocketId(): string | undefined { return this.socket.id; }
  isConnected(): boolean { return this.socket.connected; }
  getRawSocket(): Socket { return this.socket; }
}

export default SocketIOAdapter;