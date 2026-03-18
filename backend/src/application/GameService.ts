import { createPlayer, createRoom, PlayerRole, Player } from "../../core/domain";
import { GameLogic } from "../../core/services/GameLogic";
import {
  GameCommands,
  CreateRoomCommand,
  CreateRoomResponse,
  JoinRoomCommand,
  JoinRoomResponse,
  MakeMoveCommand,
  MakeMoveResponse,
  SendChatCommand,
  ResetScoreCommand,
  SearchOpponentCommand,
  SearchOpponentResponse,
  PlayWithFriendCommand,
} from "../../ports/inbound";
import { GameStatePort, NotificationPort } from "../../ports/outbound";

export class GameService implements GameCommands {
  private waitingPlayer: { sessionId: string; socketId: string; name: string } | null = null;
  private players = new Map<string, Player>();
  private socketToSession = new Map<string, string>();
  private roomPlayers = new Map<string, Set<string>>();

  constructor(
    private gameState: GameStatePort,
    private notification: NotificationPort
  ) {}

  createRoom(cmd: CreateRoomCommand): CreateRoomResponse {
    const roomId = this.generateRoomId();
    const room = createRoom(roomId);
    const player = createPlayer({ sessionId: cmd.sessionId, socketId: cmd.socketId, name: cmd.hostName, role: "X", roomId });
    this.savePlayer(player);
    this.gameState.saveRoom(room);
    this.notification.joinSocketToRoom(cmd.socketId, `room${roomId}`);
    return { roomId, player: { sessionId: player.sessionId, name: player.name, role: player.role } };
  }

  joinRoom(cmd: JoinRoomCommand): JoinRoomResponse {
    const room = this.gameState.getRoom(cmd.roomId);
    if (!room) return { success: false, message: "Room not found" };
    const existingPlayers = this.getPlayersInRoom(cmd.roomId);
    if (existingPlayers.length >= 2) return { success: false, message: "Room is full" };
    const hostPlayer = existingPlayers[0];
    const newRole: PlayerRole = hostPlayer?.role === "X" ? "O" : "X";
    const player = createPlayer({ sessionId: cmd.sessionId, socketId: cmd.socketId, name: cmd.name, role: newRole, roomId: cmd.roomId });
    this.savePlayer(player);
    this.gameState.addPlayerToRoom(cmd.roomId, cmd.sessionId);
    this.notification.joinSocketToRoom(cmd.socketId, `room${cmd.roomId}`);
    if (existingPlayers.length === 1) this.gameState.startGame(cmd.roomId);
    const allPlayers = this.getPlayersInRoom(cmd.roomId);
    if (allPlayers.length === 2) {
      const playerX = allPlayers.find(p => p.role === "X");
      const playerO = allPlayers.find(p => p.role === "O");
      this.notification.emitToRoom(cmd.roomId, "gameStarted", { players: { X: { name: playerX?.name, sessionId: playerX?.sessionId }, O: { name: playerO?.name, sessionId: playerO?.sessionId } }, currentTurn: "X" });
    }
    return { success: true, player: { sessionId: player.sessionId, name: player.name, role: player.role }, gameStarted: existingPlayers.length === 1, existingPlayer: hostPlayer ? { name: hostPlayer.name, role: hostPlayer.role } : undefined };
  }

  makeMove(cmd: MakeMoveCommand): MakeMoveResponse {
    const player = this.players.get(cmd.sessionId);
    if (!player || player.role !== cmd.role) return { success: false, board: [], currentTurn: "X", gameOver: false, winner: null, isDraw: false, winningLine: null };
    const room = this.gameState.getRoom(cmd.roomId);
    if (!room) return { success: false, board: [], currentTurn: "X", gameOver: false, winner: null, isDraw: false, winningLine: null };
    if (!GameLogic.validateMove(room.board, cmd.position)) return { success: false, board: room.board, currentTurn: room.currentTurn, gameOver: false, winner: null, isDraw: false, winningLine: null };
    const result = GameLogic.makeMove(room.board, cmd.position, cmd.role);
    this.gameState.updateRoomBoard(cmd.roomId, result.board);
    if (result.gameOver && result.winner) {
      const newScore = result.winner === "X" ? { xScore: room.score.xScore + 1, oScore: room.score.oScore } : { xScore: room.score.xScore, oScore: room.score.oScore + 1 };
      this.gameState.updateRoomScore(cmd.roomId, newScore);
    } else if (!result.gameOver) this.gameState.updateRoomTurn(cmd.roomId, result.currentTurn);
    this.notification.emitToRoom(cmd.roomId, "roomMoveUpdate", { position: cmd.position, currentMovePlayer: player.name, turn: result.currentTurn, board: result.board, role: cmd.role, score: room.score });
    return { success: true, board: result.board, currentTurn: result.currentTurn, gameOver: result.gameOver, winner: result.winner, isDraw: result.isDraw, winningLine: result.winningLine };
  }

  sendChat(cmd: SendChatCommand): { success: boolean } {
    const player = this.players.get(cmd.sessionId);
    if (!player) return { success: false };
    this.notification.emitToRoom(cmd.roomId, "roomChatUpdate", { from: player.name, message: cmd.message });
    return { success: true };
  }

  resetScore(cmd: ResetScoreCommand): { success: boolean; score?: { xScore: number; oScore: number } } {
    const player = this.players.get(cmd.sessionId);
    if (!player) return { success: false };
    const room = this.gameState.getRoom(cmd.roomId);
    if (!room) return { success: false };
    const newScore = { xScore: 0, oScore: 0 };
    this.gameState.updateRoomScore(cmd.roomId, newScore);
    this.notification.emitToRoom(cmd.roomId, "resetScoreRoomClient", { score: newScore });
    return { success: true, score: newScore };
  }

  searchOpponent(cmd: SearchOpponentCommand): SearchOpponentResponse {
    if (this.waitingPlayer) {
      const roomId = this.generateRoomId();
      const room = createRoom(roomId);
      const hostPlayer = createPlayer({ sessionId: this.waitingPlayer.sessionId, socketId: this.waitingPlayer.socketId, name: this.waitingPlayer.name, role: "X", roomId });
      const joinPlayer = createPlayer({ sessionId: cmd.sessionId, socketId: cmd.socketId, name: cmd.name, role: "O", roomId });
      this.savePlayer(hostPlayer);
      this.savePlayer(joinPlayer);
      this.gameState.saveRoom(room);
      this.gameState.addPlayerToRoom(roomId, hostPlayer.sessionId);
      this.gameState.addPlayerToRoom(roomId, joinPlayer.sessionId);
      this.gameState.startGame(roomId);
      this.notification.joinSocketToRoom(hostPlayer.socketId, `room${roomId}`);
      this.notification.joinSocketToRoom(cmd.socketId, `room${roomId}`);
      this.notification.emitToRoom(roomId, "findRoom", { id: roomId });
      this.waitingPlayer = null;
      return { roomId, message: "Match found!" };
    }
    this.waitingPlayer = { sessionId: cmd.sessionId, socketId: cmd.socketId, name: cmd.name };
    return { roomId: null, message: "Searching for opponent..." };
  }

  cancelSearch(socketId: string): void { if (this.waitingPlayer?.socketId === socketId) this.waitingPlayer = null; }

  playWithFriend(cmd: PlayWithFriendCommand): { roomId: string; gameStarted: boolean } { return { roomId: cmd.roomId, gameStarted: false }; }

  private savePlayer(player: Player): void {
    this.players.set(player.sessionId, player);
    this.socketToSession.set(player.socketId, player.sessionId);
    if (!this.roomPlayers.has(player.roomId)) this.roomPlayers.set(player.roomId, new Set());
    this.roomPlayers.get(player.roomId)!.add(player.sessionId);
  }

  private getPlayersInRoom(roomId: string): Player[] {
    const sessionIds = this.roomPlayers.get(roomId);
    if (!sessionIds) return [];
    return Array.from(sessionIds).map(sid => this.players.get(sid)).filter((p): p is Player => p !== undefined);
  }

  private generateRoomId(): string { return crypto.randomUUID().slice(0, 7); }
}

export default GameService;