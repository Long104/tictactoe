import { type RoomState, type PlayerState } from "./type";

export const rooms = new Map<string, RoomState>();
export const players = new Map<string, PlayerState>();
export const sessionBySocket = new Map<string, string>();
export const roomPlayers = new Map<string, Set<string>>();

function getRoom(roomId: string): RoomState | undefined {
  return rooms.get(roomId);
}

function getPlayerBySessionId(sessionId: string): PlayerState | undefined {
  return players.get(sessionId);
}

function getPlayerBySocketId(socketId: string): PlayerState | undefined {
  const sessionId = sessionBySocket.get(socketId);
  if (!sessionId) return undefined;
  return players.get(sessionId);
}

// function getPlayersInRoom(roomId: string): PlayerState[] {
function getPlayersInRoom(roomId: string): any {
  const sessionIds = roomPlayers.get(roomId);
  if (!sessionIds) return [];

  // need to this because new socket always join in the roomPlayers so we need filter to show only not undefined
  // return Array.from(sessionIds)
  //   .map((sessionId) => players.get(sessionId))
  //   .filter((player): player is PlayerState => player !== undefined);

  return Array.from(sessionIds);

  // it will return as array
}

function createRoom(roomId: string): RoomState {
  const roomState: RoomState = {
    roomId,
    board: ["", "", "", "", "", "", "", "", ""],
    currentTurn: "X",
    gameStarted: false,
    createdAt: Date.now(),
    score: { oScore: 0, xScore: 0 },
  };

  rooms.set(roomId, roomState);
  return roomState;
}

function addPlayerToRoom(player: PlayerState): void {
  if (!roomPlayers.has(player.roomId)) {
    roomPlayers.set(player.roomId, new Set());
  }
  roomPlayers.get(player.roomId)!.add(player.sessionId);
}

function removePlayerFromRoom(socketId: string): void {
  const sessionId = sessionBySocket.get(socketId);
  if (sessionId) {
    const player = players.get(sessionId);
    if (player) {
      roomPlayers.get(player.roomId)?.delete(sessionId);
    }
  }
}

function removePlayerBySocketId(socketId: string): void {
  const sessionId = sessionBySocket.get(socketId);
  if (sessionId) {
    const player = players.get(sessionId);
    if (player) {
      players.delete(sessionId);
    }
  }
}

function removeSessionBySocket(socketId: string): void {
  sessionBySocket.delete(socketId);
}

function removeRoomBySocketId(socketId: string) {
  const sessionId = sessionBySocket.get(socketId);
  if (sessionId) {
    const player = players.get(sessionId);
    if (player) {
      rooms.delete(player.roomId);
    }
  }
}

export {
  removeRoomBySocketId,
  removePlayerFromRoom,
  removePlayerBySocketId,
  removeSessionBySocket,
  addPlayerToRoom,
  createRoom,
  getPlayerBySocketId,
  getPlayersInRoom,
  getRoom,
  getPlayerBySessionId,
};
