import { Room } from "../../core/domain";

export interface GameStatePort {
  saveRoom(room: Room): void;
  getRoom(roomId: string): Room | undefined;
  deleteRoom(roomId: string): void;
  getAllRooms(): Room[];
  addPlayerToRoom(roomId: string, sessionId: string): void;
  removePlayerFromRoom(roomId: string, sessionId: string): void;
  updateRoomBoard(roomId: string, board: string[]): void;
  updateRoomTurn(roomId: string, turn: "X" | "O"): void;
  updateRoomScore(roomId: string, score: { xScore: number; oScore: number }): void;
  startGame(roomId: string): void;
}