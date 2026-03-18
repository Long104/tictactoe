import { IRoomRepository } from "../interfaces/IRoomRepository";
import { IPlayerRepository } from "../interfaces/IPlayerRepository";
import { INotificationGateway } from "../interfaces/INotificationGateway";
import { ResetScoreDTO } from "../dto";

export class ResetScoreUseCase {
  constructor(
    private roomRepository: IRoomRepository,
    private playerRepository: IPlayerRepository,
    private notificationGateway: INotificationGateway
  ) {}

  execute(dto: ResetScoreDTO): { success: boolean; score?: { xScore: number; oScore: number } } {
    const player = this.playerRepository.findBySessionId(dto.sessionId);
    
    if (!player) {
      return { success: false };
    }

    const room = this.roomRepository.findById(dto.roomId);
    
    if (!room) {
      return { success: false };
    }

    const newScore = { xScore: 0, oScore: 0 };
    this.roomRepository.updateScore(dto.roomId, newScore);

    this.notificationGateway.emitToRoom(dto.roomId, "resetScoreRoomClient", {
      score: newScore,
    });

    return { success: true, score: newScore };
  }
}