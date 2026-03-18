import { Player, PlayerRole } from "../../domain/entities";

export interface IPlayerRepository {
  save(player: Player): void;
  findBySessionId(sessionId: string): Player | undefined;
  findBySocketId(socketId: string): Player | undefined;
  delete(sessionId: string): void;
  deleteBySocketId(socketId: string): void;
  findByRoomId(roomId: string): Player[];
  findAll(): Player[];
}