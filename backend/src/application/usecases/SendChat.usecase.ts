import { IRoomRepository } from "../interfaces/IRoomRepository";
import { IPlayerRepository } from "../interfaces/IPlayerRepository";
import { INotificationGateway } from "../interfaces/INotificationGateway";
import { SendChatDTO } from "../dto";

export class SendChatUseCase {
  constructor(
    private roomRepository: IRoomRepository,
    private playerRepository: IPlayerRepository,
    private notificationGateway: INotificationGateway
  ) {}

  execute(dto: SendChatDTO): { success: boolean } {
    const player = this.playerRepository.findBySessionId(dto.sessionId);
    
    if (!player) {
      return { success: false };
    }

    this.notificationGateway.emitToRoom(dto.roomId, "roomChatUpdate", {
      from: player.name,
      message: dto.message,
    });

    return { success: true };
  }
}