import { PlayerRole } from "../../core/domain";

export interface CreateRoomCommand {
  roomName: string;
  hostName: string;
  sessionId: string;
  socketId: string;
}

export interface CreateRoomResponse {
  roomId: string;
  player: {
    sessionId: string;
    name: string;
    role: PlayerRole;
  };
}

export interface JoinRoomCommand {
  sessionId: string;
  socketId: string;
  name: string;
  roomId: string;
}

export interface JoinRoomResponse {
  success: boolean;
  player?: {
    sessionId: string;
    name: string;
    role: PlayerRole;
  };
  gameStarted?: boolean;
  existingPlayer?: {
    name: string;
    role: PlayerRole;
  };
  message?: string;
}

export interface MakeMoveCommand {
  sessionId: string;
  roomId: string;
  position: number;
  role: PlayerRole;
}

export interface MakeMoveResponse {
  success: boolean;
  board: string[];
  currentTurn: PlayerRole;
  gameOver: boolean;
  winner: PlayerRole | null;
  isDraw: boolean;
  winningLine: number[] | null;
}

export interface SendChatCommand {
  sessionId: string;
  roomId: string;
  message: string;
}

export interface ResetScoreCommand {
  roomId: string;
  sessionId: string;
}

export interface SearchOpponentCommand {
  sessionId: string;
  socketId: string;
  name: string;
}

export interface SearchOpponentResponse {
  roomId: string | null;
  message: string;
}

export interface PlayWithFriendCommand {
  sessionId: string;
  socketId: string;
  name: string;
  roomId: string;
}

export interface GameCommands {
  createRoom(cmd: CreateRoomCommand): CreateRoomResponse;
  joinRoom(cmd: JoinRoomCommand): JoinRoomResponse;
  makeMove(cmd: MakeMoveCommand): MakeMoveResponse;
  sendChat(cmd: SendChatCommand): { success: boolean };
  resetScore(cmd: ResetScoreCommand): { success: boolean; score?: { xScore: number; oScore: number } };
  searchOpponent(cmd: SearchOpponentCommand): SearchOpponentResponse;
  playWithFriend(cmd: PlayWithFriendCommand): { roomId: string; gameStarted: boolean };
  cancelSearch(socketId: string): void;
}