import { PlayerRole } from "../../domain/entities/Player";

export interface CreateRoomDTO {
  roomName: string;
  hostName: string;
  sessionId: string;
  socketId: string;
}

export interface CreateRoomResult {
  roomId: string;
  player: {
    sessionId: string;
    name: string;
    role: PlayerRole;
  };
}

export interface JoinRoomDTO {
  sessionId: string;
  socketId: string;
  name: string;
  roomId: string;
}

export interface JoinRoomResult {
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

export interface MakeMoveDTO {
  sessionId: string;
  roomId: string;
  position: number;
  role: PlayerRole;
}

export interface MakeMoveResult {
  success: boolean;
  board: string[];
  currentTurn: PlayerRole;
  gameOver: boolean;
  winner: PlayerRole | null;
  isDraw: boolean;
  winningLine: number[] | null;
}

export interface SendChatDTO {
  sessionId: string;
  roomId: string;
  message: string;
}

export interface ResetScoreDTO {
  roomId: string;
  sessionId: string;
}

export interface SearchOpponentDTO {
  sessionId: string;
  socketId: string;
  name: string;
}

export interface SearchOpponentResult {
  roomId: string | null;
  message: string;
}

export interface PlayWithFriendDTO {
  sessionId: string;
  socketId: string;
  name: string;
  roomId: string;
}

export interface PlayWithFriendResult {
  roomId: string;
  gameStarted: boolean;
}