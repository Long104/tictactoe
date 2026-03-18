export type PlayerRole = "X" | "O";

export interface Player {
  sessionId: string;
  name: string;
  role: PlayerRole;
  roomId?: string;
}

export function createPlayer(params: { sessionId: string; name: string; role: PlayerRole; roomId?: string }): Player {
  return { sessionId: params.sessionId, name: params.name, role: params.role, roomId: params.roomId };
}