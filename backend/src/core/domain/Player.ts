export type PlayerRole = "X" | "O";

export interface Player {
  sessionId: string;
  socketId: string;
  roomId: string;
  name: string;
  role: PlayerRole;
  joinedAt: number;
}

export function createPlayer(params: {
  sessionId: string;
  socketId: string;
  name: string;
  role: PlayerRole;
  roomId: string;
}): Player {
  return {
    sessionId: params.sessionId,
    socketId: params.socketId,
    name: params.name,
    role: params.role,
    roomId: params.roomId,
    joinedAt: Date.now(),
  };
}