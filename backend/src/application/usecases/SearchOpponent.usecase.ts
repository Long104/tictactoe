import { createPlayer, createRoom, PlayerRole } from "../../domain/entities";
import { IRoomRepository } from "../interfaces/IRoomRepository";
import { IPlayerRepository } from "../interfaces/IPlayerRepository";
import { INotificationGateway } from "../interfaces/INotificationGateway";
import { SearchOpponentDTO, SearchOpponentResult } from "../dto";

export class SearchOpponentUseCase {
  private waitingPlayer: {
    sessionId: string;
    socketId: string;
    name: string;
  } | null = null;

  constructor(
    private roomRepository: IRoomRepository,
    private playerRepository: IPlayerRepository,
    private notificationGateway: INotificationGateway
  ) {}

  execute(dto: SearchOpponentDTO): SearchOpponentResult {
    if (this.waitingPlayer) {
      const roomId = this.generateRoomId();
      
      const room = createRoom(roomId);
      this.roomRepository.save(room);

      const hostPlayer = createPlayer({
        sessionId: this.waitingPlayer.sessionId,
        socketId: this.waitingPlayer.socketId,
        name: this.waitingPlayer.name,
        role: "X",
        roomId: roomId,
      });

      const joinPlayer = createPlayer({
        sessionId: dto.sessionId,
        socketId: dto.socketId,
        name: dto.name,
        role: "O",
        roomId: roomId,
      });

      this.roomRepository.addPlayer(roomId, hostPlayer.sessionId);
      this.roomRepository.addPlayer(roomId, joinPlayer.sessionId);
      this.playerRepository.save(hostPlayer);
      this.playerRepository.save(joinPlayer);

      this.roomRepository.startGame(roomId);

      this.notificationGateway.joinRoom(hostPlayer.socketId, `room${roomId}`);
      this.notificationGateway.joinRoom(dto.socketId, `room${roomId}`);

      this.notificationGateway.emitToRoom(roomId, "findRoom", { id: roomId });

      this.waitingPlayer = null;

      return {
        roomId: roomId,
        message: "Match found!",
      };
    }

    this.waitingPlayer = {
      sessionId: dto.sessionId,
      socketId: dto.socketId,
      name: dto.name,
    };

    return {
      roomId: null,
      message: "Searching for opponent...",
    };
  }

  cancelSearch(socketId: string): void {
    if (this.waitingPlayer?.socketId === socketId) {
      this.waitingPlayer = null;
    }
  }

  private generateRoomId(): string {
    return crypto.randomUUID().slice(0, 7);
  }
}