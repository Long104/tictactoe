import { Board, arrayToBoard, boardToArray } from "../../domain/value-objects/Board";
import { GameEngine } from "../../domain/services/GameEngine";
import { IRoomRepository } from "../interfaces/IRoomRepository";
import { IPlayerRepository } from "../interfaces/IPlayerRepository";
import { INotificationGateway, RoomMoveNotification } from "../interfaces/INotificationGateway";
import { MakeMoveDTO, MakeMoveResult } from "../dto";

export class MakeMoveUseCase {
  constructor(
    private roomRepository: IRoomRepository,
    private playerRepository: IPlayerRepository,
    private notificationGateway: INotificationGateway
  ) {}

  execute(dto: MakeMoveDTO): MakeMoveResult {
    const player = this.playerRepository.findBySessionId(dto.sessionId);
    
    if (!player) {
      return {
        success: false,
        board: [],
        currentTurn: "X",
        gameOver: false,
        winner: null,
        isDraw: false,
        winningLine: null,
      };
    }

    if (player.role !== dto.role) {
      return {
        success: false,
        board: [],
        currentTurn: "X",
        gameOver: false,
        winner: null,
        isDraw: false,
        winningLine: null,
      };
    }

    const room = this.roomRepository.findById(dto.roomId);
    
    if (!room) {
      return {
        success: false,
        board: [],
        currentTurn: "X",
        gameOver: false,
        winner: null,
        isDraw: false,
        winningLine: null,
      };
    }

    const board = arrayToBoard(room.board);
    
    if (!GameEngine.validateMove(board, dto.position)) {
      return {
        success: false,
        board: room.board,
        currentTurn: room.currentTurn,
        gameOver: false,
        winner: null,
        isDraw: false,
        winningLine: null,
      };
    }

    const result = GameEngine.makeMove(board, dto.position, dto.role);

    this.roomRepository.updateBoard(dto.roomId, boardToArray(result.board));
    
    if (result.gameOver) {
      if (result.winner) {
        const currentScore = room.score;
        const newScore = result.winner === "X"
          ? { xScore: currentScore.xScore + 1, oScore: currentScore.oScore }
          : { xScore: currentScore.xScore, oScore: currentScore.oScore + 1 };
        this.roomRepository.updateScore(dto.roomId, newScore);
      }
    } else {
      this.roomRepository.updateTurn(dto.roomId, result.currentTurn);
    }

    const notification: RoomMoveNotification = {
      position: dto.position,
      currentMovePlayer: player.name,
      turn: result.currentTurn,
      board: result.board.cells,
      role: dto.role,
      score: room.score,
    };

    this.notificationGateway.emitToRoom(dto.roomId, "roomMoveUpdate", notification);

    return {
      success: true,
      board: result.board.cells,
      currentTurn: result.currentTurn,
      gameOver: result.gameOver,
      winner: result.winner,
      isDraw: result.isDraw,
      winningLine: result.winningLine,
    };
  }
}