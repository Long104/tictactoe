import { Server } from "socket.io";
import { NotificationPort } from "../../ports/outbound";

export class SocketIOAdapter implements NotificationPort {
  constructor(private io: Server) {}

  emitToRoom(roomId: string, event: string, data: unknown): void { this.io.to(`room${roomId}`).emit(event, data); }
  emitToSocket(socketId: string, event: string, data: unknown): void {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) { socket.emit(event, data); }
  }
  emitToAll(event: string, data: unknown): void { this.io.emit(event, data); }
  joinSocketToRoom(socketId: string, roomId: string): void {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) { socket.join(`room${roomId}`); }
  }
  leaveSocketFromRoom(socketId: string, roomId: string): void {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) { socket.leave(`room${roomId}`); }
  }
  getSocketsInRoom(roomId: string): string[] {
    const room = this.io.sockets.adapter.rooms.get(`room${roomId}`);
    if (!room) return [];
    return Array.from(room);
  }
}

export default SocketIOAdapter;