import { Room } from "../../domain/entities";
import { IRoomRepository } from "../../application/interfaces";

export class InMemoryRoomRepository implements IRoomRepository {
  private rooms = new Map<string, Room>();

  save(room: Room): void {
    this.rooms.set(room.roomId, { ...room });
  }

  findById(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  delete(roomId: string): void {
    this.rooms.delete(roomId);
  }

  findAll(): Room[] {
    return Array.from(this.rooms.values());
  }

  addPlayer(roomId: string, sessionId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      if (!room.players.has(sessionId)) {
        room.players.set(sessionId, {} as any);
      }
    }
  }

  removePlayer(roomId: string, sessionId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.players.delete(sessionId);
    }
  }

  updateBoard(roomId: string, board: string[]): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.board = board;
    }
  }

  updateTurn(roomId: string, turn: "X" | "O"): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.currentTurn = turn;
    }
  }

  updateScore(roomId: string, score: { xScore: number; oScore: number }): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.score = score;
    }
  }

  startGame(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.gameStarted = true;
      room.currentTurn = "X";
    }
  }

  getPlayerCount(roomId: string): number {
    const room = this.rooms.get(roomId);
    return room ? room.players.size : 0;
  }
}

export default InMemoryRoomRepository;