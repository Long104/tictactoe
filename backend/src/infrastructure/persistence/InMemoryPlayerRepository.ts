import { Player } from "../../domain/entities";
import { IPlayerRepository } from "../../application/interfaces";

export class InMemoryPlayerRepository implements IPlayerRepository {
  private players = new Map<string, Player>();
  private socketToSession = new Map<string, string>();
  private roomPlayers = new Map<string, Set<string>>();

  save(player: Player): void {
    this.players.set(player.sessionId, player);
    this.socketToSession.set(player.socketId, player.sessionId);
    
    if (!this.roomPlayers.has(player.roomId)) {
      this.roomPlayers.set(player.roomId, new Set());
    }
    this.roomPlayers.get(player.roomId)!.add(player.sessionId);
  }

  findBySessionId(sessionId: string): Player | undefined {
    return this.players.get(sessionId);
  }

  findBySocketId(socketId: string): Player | undefined {
    const sessionId = this.socketToSession.get(socketId);
    if (!sessionId) return undefined;
    return this.players.get(sessionId);
  }

  delete(sessionId: string): void {
    const player = this.players.get(sessionId);
    if (player) {
      this.socketToSession.delete(player.socketId);
      this.roomPlayers.get(player.roomId)?.delete(sessionId);
      this.players.delete(sessionId);
    }
  }

  deleteBySocketId(socketId: string): void {
    const sessionId = this.socketToSession.get(socketId);
    if (sessionId) {
      this.delete(sessionId);
    }
  }

  findByRoomId(roomId: string): Player[] {
    const sessionIds = this.roomPlayers.get(roomId);
    if (!sessionIds) return [];
    return Array.from(sessionIds)
      .map(sid => this.players.get(sid))
      .filter((p): p is Player => p !== undefined);
  }

  findAll(): Player[] {
    return Array.from(this.players.values());
  }

  clearRoom(roomId: string): void {
    const sessionIds = this.roomPlayers.get(roomId);
    if (sessionIds) {
      sessionIds.forEach(sid => {
        const player = this.players.get(sid);
        if (player) {
          this.socketToSession.delete(player.socketId);
        }
        this.players.delete(sid);
      });
      this.roomPlayers.delete(roomId);
    }
  }
}

export default InMemoryPlayerRepository;