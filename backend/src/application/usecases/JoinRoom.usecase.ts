import { createPlayer, PlayerRole } from "../../domain/entities";
import { IRoomRepository } from "../interfaces/IRoomRepository";
import { IPlayerRepository } from "../interfaces/IPlayerRepository";
import { INotificationGateway } from "../interfaces/INotificationGateway";
import { JoinRoomDTO, JoinRoomResult } from "../dto";

export class JoinRoomUseCase {
  constructor(
    private roomRepository: IRoomRepository,
    private playerRepository: IPlayerRepository,
    private notificationGateway: INotificationGateway
  ) {}

  execute(dto: JoinRoomDTO): JoinRoomResult {
    const room = this.roomRepository.findById(dto.roomId);
    
    if (!room) {
      return {
        success: false,
        message: "Room not found",
      };
    }

    const existingPlayers = this.playerRepository.findByRoomId(dto.roomId);
    
    if (existingPlayers.length >= 2) {
      return {
        success: false,
        message: "Room is full",
      };
    }

    const hostPlayer = existingPlayers[0];
    const newRole: PlayerRole = hostPlayer?.role === "X" ? "O" : "X";

    const player = createPlayer({
      sessionId: dto.sessionId,
      socketId: dto.socketId,
      name: dto.name,
      role: newRole,
      roomId: dto.roomId,
    });

    this.roomRepository.addPlayer(dto.roomId, dto.sessionId);
    this.playerRepository.save(player);
    this.notificationGateway.joinRoom(dto.socketId, `room${dto.roomId}`);

    if (existingPlayers.length === 1) {
      this.roomRepository.startGame(dto.roomId);
    }

    const allPlayers = this.playerRepository.findByRoomId(dto.roomId);
    const playerX = allPlayers.find(p => p.role === "X");
    const playerO = allPlayers.find(p => p.role === "O");

    if (allPlayers.length === 2) {
      this.notificationGateway.emitToRoom(dto.roomId, "gameStarted", {
        players: {
          X: { name: playerX?.name, sessionId: playerX?.sessionId },
          O: { name: playerO?.name, sessionId: playerO?.sessionId },
        },
        currentTurn: "X",
      });
    }

    return {
      success: true,
      player: {
        sessionId: player.sessionId,
        name: player.name,
        role: player.role,
      },
      gameStarted: existingPlayers.length === 1,
      existingPlayer: hostPlayer ? {
        name: hostPlayer.name,
        role: hostPlayer.role,
      } : undefined,
    };
  }
}