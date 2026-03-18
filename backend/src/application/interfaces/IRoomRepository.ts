import { Room } from "../../domain/entities";

export interface IRoomRepository {
  save(room: Room): void;
  findById(roomId: string): Room | undefined;
  delete(roomId: string): void;
  findAll(): Room[];
  addPlayer(roomId: string, sessionId: string): void;
  removePlayer(roomId: string, sessionId: string): void;
  updateBoard(roomId: string, board: string[]): void;
  updateTurn(roomId: string, turn: "X" | "O"): void;
  updateScore(roomId: string, score: { xScore: number; oScore: number }): void;
  startGame(roomId: string): void;
}