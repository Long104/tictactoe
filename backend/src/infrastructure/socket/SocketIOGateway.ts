import { Server, Socket } from "socket.io";
import { INotificationGateway } from "../../application/interfaces";

export class SocketIOGateway implements INotificationGateway {
  constructor(private io: Server) {}

  emitToRoom(roomId: string, event: string, data: unknown): void {
    this.io.to(`room${roomId}`).emit(event, data);
  }

  emitToSocket(socketId: string, event: string, data: unknown): void {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit(event, data);
    }
  }

  emitToAll(event: string, data: unknown): void {
    this.io.emit(event, data);
  }

  joinRoom(socketId: string, roomId: string): void {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.join(`room${roomId}`);
    }
  }

  leaveRoom(socketId: string, roomId: string): void {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.leave(`room${roomId}`);
    }
  }

  getSocketsInRoom(roomId: string): string[] {
    const room = this.io.sockets.adapter.rooms.get(`room${roomId}`);
    if (!room) return [];
    return Array.from(room);
  }
}

export default SocketIOGateway;