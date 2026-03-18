import { Room } from "../../core/domain";
import { GameStatePort } from "../../ports/outbound";

export class InMemoryGameAdapter implements GameStatePort {
  private rooms = new Map<string, Room>();

  saveRoom(room: Room): void { this.rooms.set(room.roomId, { ...room }); }
  getRoom(roomId: string): Room | undefined { return this.rooms.get(roomId); }
  deleteRoom(roomId: string): void { this.rooms.delete(roomId); }
  getAllRooms(): Room[] { return Array.from(this.rooms.values()); }
  addPlayerToRoom(roomId: string, sessionId: string): void {
    const room = this.rooms.get(roomId);
    if (room && !room.players.has(sessionId)) { room.players.set(sessionId, {} as any); }
  }
  removePlayerFromRoom(roomId: string, sessionId: string): void {
    const room = this.rooms.get(roomId);
    if (room) { room.players.delete(sessionId); }
  }
  updateRoomBoard(roomId: string, board: string[]): void {
    const room = this.rooms.get(roomId);
    if (room) { room.board = board; }
  }
  updateRoomTurn(roomId: string, turn: "X" | "O"): void {
    const room = this.rooms.get(roomId);
    if (room) { room.currentTurn = turn; }
  }
  updateRoomScore(roomId: string, score: { xScore: number; oScore: number }): void {
    const room = this.rooms.get(roomId);
    if (room) { room.score = score; }
  }
  startGame(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) { room.gameStarted = true; room.currentTurn = "X"; }
  }
}

export default InMemoryGameAdapter;