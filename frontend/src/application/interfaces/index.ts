import { MoveResult } from "../../domain/services/GameEngine";

export interface ISocketGateway {
  connect(): void;
  disconnect(): void;
  emit(event: string, data: unknown): void;
  on(event: string, callback: (data: unknown) => void): void;
  off(event: string, callback?: (data: unknown) => void): void;
  getSocketId(): string | undefined;
  isConnected(): boolean;
}

export interface IMoveResult {
  position: number;
  player: "X" | "O";
  result: MoveResult;
}

export interface IGamePresenter {
  makeMove(position: number): IMoveResult | null;
  resetGame(): void;
  resetScore(): void;
  getState(): {
    board: string[];
    currentTurn: "X" | "O";
    status: "" | "X" | "O" | "draw";
    winningLine: number[];
    xScore: number;
    oScore: number;
  };
}

export interface IOnlineGamePresenter {
  makeMove(position: number): void;
  resetGame(): void;
  resetScore(): void;
  getState(): {
    board: string[];
    currentTurn: "X" | "O";
    status: string;
    role: "X" | "O" | undefined;
    turn: string;
    score: { xScore: number; oScore: number };
  };
}