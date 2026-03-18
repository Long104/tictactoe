import { createRoom as createRoomEntity, createPlayer, Player } from "../../domain/entities";
import { IRoomRepository } from "../interfaces/IRoomRepository";
import { IPlayerRepository } from "../interfaces/IPlayerRepository";
import { INotificationGateway } from "../interfaces/INotificationGateway";
import { CreateRoomDTO, CreateRoomResult } from "../dto";

export class CreateRoomUseCase {
  constructor(
    private roomRepository: IRoomRepository,
    private playerRepository: IPlayerRepository,
    private notificationGateway: INotificationGateway
  ) {}

  execute(dto: CreateRoomDTO): CreateRoomResult {
    const roomId = this.generateRoomId();
    const room = createRoomEntity(roomId);
    
    const player = createPlayer({
      sessionId: dto.sessionId,
      socketId: dto.socketId,
      name: dto.hostName,
      role: "X",
      roomId: roomId,
    });

    this.roomRepository.save(room);
    this.playerRepository.save(player);
    this.notificationGateway.joinRoom(dto.socketId, `room${roomId}`);

    return {
      roomId: roomId,
      player: {
        sessionId: player.sessionId,
        name: player.name,
        role: player.role,
      },
    };
  }

  private generateRoomId(): string {
    return crypto.randomUUID().slice(0, 7);
  }
}