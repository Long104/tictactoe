import { Server, Socket } from "socket.io";
import { IPlayerRepository } from "../../application/interfaces";
import { IRoomRepository } from "../../application/interfaces";
import { INotificationGateway } from "../../application/interfaces";
import {
  CreateRoomUseCase,
  JoinRoomUseCase,
  MakeMoveUseCase,
  SendChatUseCase,
  ResetScoreUseCase,
  SearchOpponentUseCase,
} from "../../application/usecases";
import { PlayerRole } from "../../domain/entities";

export class SocketHandler {
  private createRoomUseCase: CreateRoomUseCase;
  private joinRoomUseCase: JoinRoomUseCase;
  private makeMoveUseCase: MakeMoveUseCase;
  private sendChatUseCase: SendChatUseCase;
  private resetScoreUseCase: ResetScoreUseCase;
  private searchOpponentUseCase: SearchOpponentUseCase;

  private waitingRooms = new Map<string, { socket: Socket; roomName: string; player: string; roomId: string }>();
  private playWithFriends = new Map<string, Socket>();

  constructor(
    private io: Server,
    playerRepository: IPlayerRepository,
    roomRepository: IRoomRepository,
    notificationGateway: INotificationGateway
  ) {
    this.createRoomUseCase = new CreateRoomUseCase(roomRepository, playerRepository, notificationGateway);
    this.joinRoomUseCase = new JoinRoomUseCase(roomRepository, playerRepository, notificationGateway);
    this.makeMoveUseCase = new MakeMoveUseCase(roomRepository, playerRepository, notificationGateway);
    this.sendChatUseCase = new SendChatUseCase(roomRepository, playerRepository, notificationGateway);
    this.resetScoreUseCase = new ResetScoreUseCase(roomRepository, playerRepository, notificationGateway);
    this.searchOpponentUseCase = new SearchOpponentUseCase(roomRepository, playerRepository, notificationGateway);
  }

  handleConnection(socket: Socket): void {
    socket.on("setPlayerName", (data: { name: string; sessionId: string }) => {
      socket.data.name = data.name;
      socket.data.sessionId = data.sessionId;
    });

    socket.on("createRoom", (data: { roomName: string; player: string }) => {
      const result = this.createRoomUseCase.execute({
        roomName: data.roomName,
        hostName: data.player,
        sessionId: socket.data.sessionId,
        socketId: socket.id,
      });

      this.waitingRooms.set(result.roomId, {
        socket,
        roomName: data.roomName,
        player: data.player,
        roomId: result.roomId,
      });

      this.io.emit("dashboard", Array.from(this.waitingRooms.values()).map(r => ({
        roomName: r.roomName,
        player: r.player,
        roomId: r.roomId,
      })));
    });

    socket.on("getDashboard", () => {
      this.io.emit("dashboard", Array.from(this.waitingRooms.values()).map(r => ({
        roomName: r.roomName,
        player: r.player,
        roomId: r.roomId,
      })));
    });

    socket.on("chooseRoom", (data: { roomId: string }) => {
      const room = this.waitingRooms.get(data.roomId);
      if (!room || room.socket.id === socket.id) return;

      socket.join(`room${data.roomId}`);
      room.socket.join(`room${data.roomId}`);

      const joinResult = this.joinRoomUseCase.execute({
        sessionId: socket.data.sessionId,
        socketId: socket.id,
        name: socket.data.name || "Player 2",
        roomId: data.roomId,
      });

      if (joinResult.success && joinResult.gameStarted) {
        this.io.to(`room${data.roomId}`).emit("findRoom", { id: data.roomId });
      }

      this.waitingRooms.delete(data.roomId);
      this.updateDashboard();
    });

    socket.on("searchRoom", () => {
      const result = this.searchOpponentUseCase.execute({
        sessionId: socket.data.sessionId,
        socketId: socket.id,
        name: socket.data.name || "Player",
      });

      if (result.roomId) {
        socket.emit("findRoom", { id: result.roomId });
      } else {
        socket.emit("waiting", result.message);
      }
    });

    socket.on("playWithFriend", (data: { roomId: string }) => {
      const existing = this.playWithFriends.get(data.roomId);
      
      if (existing?.id === socket.id) return;

      if (existing) {
        socket.join(`room${data.roomId}`);
        existing.join(`room${data.roomId}`);

        this.createRoomUseCase.execute({
          roomName: "Play with Friend",
          hostName: socket.data.name || "Host",
          sessionId: socket.data.sessionId,
          socketId: socket.id,
        });

        this.joinRoomUseCase.execute({
          sessionId: existing.data.sessionId,
          socketId: existing.id,
          name: existing.data.name || "Player 2",
          roomId: data.roomId,
        });

        this.io.to(`room${data.roomId}`).emit("findRoom", { id: data.roomId });
        this.playWithFriends.delete(data.roomId);
      } else {
        this.playWithFriends.set(data.roomId, socket);
      }
    });

    socket.on("joinRoom", (data: { roomId: string }) => {
      socket.join(`room${data.roomId}`);
    });

    socket.on(
      "waitingRoom",
      async (data: { sessionId: string; roomId: string }) => {
        const { roomId, sessionId } = data;
        socket.data.sessionId = sessionId;

        const result = this.joinRoomUseCase.execute({
          sessionId,
          socketId: socket.id,
          name: socket.data.name || "Player",
          roomId,
        });

        if (result.success) {
          socket.join(`room${roomId}`);

          if (result.gameStarted) {
            socket.emit("waitForOpponent", {
              role: result.player?.role,
              currentTurn: "X",
            });
          } else {
            socket.emit("waiting", "Waiting for opponent...");
          }
        } else {
          socket.emit("error", { message: result.message });
        }
      }
    );

    socket.on(
      "roomMove",
      (data: {
        position: number;
        currentMovePlayer: string;
        role: PlayerRole;
        roomId: string;
        board: string[];
        turn: string;
        score: { xScore: number; oScore: number };
      }) => {
        this.makeMoveUseCase.execute({
          sessionId: socket.data.sessionId,
          roomId: data.roomId,
          position: data.position,
          role: data.role,
        });
      }
    );

    socket.on(
      "roomChatBroadcast",
      (data: { roomId: string; from: string; message: string }) => {
        this.sendChatUseCase.execute({
          sessionId: socket.data.sessionId,
          roomId: data.roomId,
          message: data.message,
        });
      }
    );

    socket.on("resetScore", (data: { roomId: string }) => {
      this.resetScoreUseCase.execute({
        roomId: data.roomId,
        sessionId: socket.data.sessionId,
      });
    });

    socket.on("openChatBroadcast", (data: { from: string; message: string }) => {
      this.io.emit("openChatUpdate", data);
    });

    socket.on("disconnect", () => {
      this.handleDisconnect(socket);
    });
  }

  private handleDisconnect(socket: Socket): void {
    this.waitingRooms.forEach((room, roomId) => {
      if (room.socket.id === socket.id) {
        this.waitingRooms.delete(roomId);
      }
    });

    this.playWithFriends.forEach((s, roomId) => {
      if (s.id === socket.id) {
        this.playWithFriends.delete(roomId);
      }
    });

    this.searchOpponentUseCase.cancelSearch(socket.id);
    this.updateDashboard();
  }

  private updateDashboard(): void {
    this.io.emit("dashboard", Array.from(this.waitingRooms.values()).map(r => ({
      roomName: r.roomName,
      player: r.player,
      roomId: r.roomId,
    })));
  }
}

export default SocketHandler;