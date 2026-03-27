import { Hono } from "hono";
import { cors } from "hono/cors";
import type { RoomState, PlayerState } from "./type";

type WSConnection = {
  id: string;
  sessionId?: string;
  name?: string;
  roomId?: string;
  role?: "X" | "O";
};

const app = new Hono<{ Bindings: { BACKEND_URL: string } }>();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (c) => c.text("TicTacToe API"));

const connections = new Map<string, WSConnection>();
const rooms = new Map<string, RoomState>();
const players = new Map<string, PlayerState>();
const sessionByConnection = new Map<string, string>();
const roomConnections = new Map<string, Set<string>>();

function broadcastToRoom(roomId: string, message: unknown) {
  const connIds = roomConnections.get(roomId);
  if (!connIds) return;

  const msgStr = JSON.stringify(message);
  for (const connId of connIds) {
    const conn = connections.get(connId);
    if (conn) {
      const ws = getWebSocket(connId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(msgStr);
      }
    }
  }
}

const wsClients = new Map<string, WebSocket>();

function getWebSocket(connId: string): WebSocket | undefined {
  return wsClients.get(connId);
}

function getRoom(roomId: string) {
  return rooms.get(roomId);
}

function createRoom(roomId: string): RoomState {
  const room: RoomState = {
    roomId,
    board: ["", "", "", "", "", "", "", "", ""],
    currentTurn: "X",
    gameStarted: false,
    createdAt: Date.now(),
    score: { oScore: 0, xScore: 0 },
  };
  rooms.set(roomId, room);
  return room;
}

function getPlayersInRoom(roomId: string): string[] {
  const connIds = roomConnections.get(roomId);
  if (!connIds) return [];
  return Array.from(connIds)
    .map((id) => sessionByConnection.get(id))
    .filter(Boolean) as string[];
}

function addConnectionToRoom(connId: string, roomId: string) {
  if (!roomConnections.has(roomId)) {
    roomConnections.set(roomId, new Set());
  }
  roomConnections.get(roomId)!.add(connId);
}

function removeConnectionFromRoom(connId: string, roomId: string) {
  const conns = roomConnections.get(roomId);
  if (conns) {
    conns.delete(connId);
    if (conns.size === 0) {
      roomConnections.delete(roomId);
      rooms.delete(roomId);
    }
  }
}

app.get("/ws", (c) => {
  const { 0: client, 1: server } = new WebSocketPair();

  const connId = crypto.randomUUID();
  const conn: WSConnection = {
    id: connId,
    sessionId: undefined,
    name: undefined,
    roomId: undefined,
  };

  connections.set(connId, conn);
  wsClients.set(connId, client as unknown as WebSocket);

  const ws = server;

  ws.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data as string);
      const { type, payload } = data;

      switch (type) {
        case "setPlayerName": {
          const { name, sessionId } = payload;
          conn.name = name;
          conn.sessionId = sessionId || connId;
          sessionByConnection.set(connId, sessionId || connId);
          players.set(sessionId || connId, {
            sessionId: sessionId || connId,
            socketId: connId,
            roomId: "",
            name,
            role: "X",
            joinedAt: Date.now(),
          });
          break;
        }

        case "createRoom": {
          const { roomName, player } = payload;
          const roomId = crypto.randomUUID().slice(0, 7);
          conn.roomId = roomId;
          createRoom(roomId);
          addConnectionToRoom(connId, roomId);

          const roomConns = roomConnections.get(roomId);
          const roomNames = Array.from(roomConns || []).map((id) => {
            const c = connections.get(id);
            return {
              roomName,
              player: c?.name || player,
              roomId,
            };
          });

          broadcastToRoom(roomId, { type: "dashboard", payload: roomNames });
          break;
        }

        case "waitingRoom": {
          const { sessionId, roomId: waitRoomId } = payload;
          const sessId = sessionId || connId;
          const existingPlayer = players.get(sessId);

          if (existingPlayer && existingPlayer.roomId && existingPlayer.roomId !== waitRoomId) {
            const oldRoomId = existingPlayer.roomId;
            const oldConns = roomConnections.get(oldRoomId);
            if (oldConns) {
              oldConns.delete(connId);
              if (oldConns.size === 0) {
                rooms.delete(oldRoomId);
                roomConnections.delete(oldRoomId);
              }
            }
          }

          conn.roomId = waitRoomId;
          const playersInRoom = getPlayersInRoom(waitRoomId);

          if (playersInRoom.length === 0) {
            createRoom(waitRoomId);
            addConnectionToRoom(connId, waitRoomId);

            const player: PlayerState = {
              sessionId: sessId,
              socketId: connId,
              roomId: waitRoomId,
              name: conn.name || "Player 1",
              role: "X",
              joinedAt: Date.now(),
            };
            players.set(sessId, player);
            sessionByConnection.set(connId, sessId);

            ws.send(JSON.stringify({ type: "waiting", payload: "Waiting for opponent..." }));
          } else if (playersInRoom.length === 1) {
            addConnectionToRoom(connId, waitRoomId);

            const player1SessionId = playersInRoom[0];
            const player1 = players.get(player1SessionId);

            const player2: PlayerState = {
              sessionId: sessId,
              socketId: connId,
              roomId: waitRoomId,
              name: conn.name || "Player 2",
              role: player1?.role === "X" ? "O" : "X",
              joinedAt: Date.now(),
            };
            players.set(sessId, player2);
            sessionByConnection.set(connId, sessId);

            const room = getRoom(waitRoomId);
            if (room) {
              room.gameStarted = true;
              room.currentTurn = "X";
            }

            ws.send(
              JSON.stringify({
                type: "waitForOpponent",
                payload: { role: player2.role, currentTurn: "X" },
              })
            );

            const player1ConnId = player1?.socketId;
            if (player1ConnId) {
              const player1Ws = getWebSocket(player1ConnId);
              if (player1Ws && player1Ws.readyState === WebSocket.OPEN) {
                player1Ws.send(
                  JSON.stringify({
                    type: "waitForOpponent",
                    payload: { role: player1?.role, currentTurn: "X" },
                  })
                );
              }
            }
          } else {
            ws.send(JSON.stringify({ type: "error", payload: { message: "Room is full" } }));
          }
          break;
        }

        case "roomMove": {
          const { position, role, roomId: moveRoomId, board, turn, score } = payload;
          const player = players.get(sessionByConnection.get(connId) || "");

          if (!player || player.roomId !== moveRoomId) {
            ws.send(JSON.stringify({ type: "error", payload: { message: "Invalid player" } }));
            return;
          }

          if (player.role !== role) {
            ws.send(JSON.stringify({ type: "error", payload: { message: "Invalid role" } }));
            return;
          }

          const room = getRoom(moveRoomId);
          if (room) {
            room.board = board;
            room.currentTurn = turn as "X" | "O";

            broadcastToRoom(moveRoomId, {
              type: "roomMoveUpdate",
              payload: {
                position,
                currentMovePLayer: player.name,
                turn,
                board: room.board,
                role,
                score,
              },
            });
          }
          break;
        }

        case "resetScore": {
          const { roomId: resetRoomId } = payload;
          const room = getRoom(resetRoomId);
          if (room) {
            room.score = { oScore: 0, xScore: 0 };
            broadcastToRoom(resetRoomId, {
              type: "resetScoreRoomClient",
              payload: { score: room.score },
            });
          }
          break;
        }

        case "roomChatBroadcast": {
          const { roomId: chatRoomId, from, message } = payload;
          broadcastToRoom(chatRoomId, {
            type: "roomChatUpdate",
            payload: { from, message },
          });
          break;
        }

        case "joinRoom": {
          const { roomId: joinRoomId } = payload;
          conn.roomId = joinRoomId;
          addConnectionToRoom(connId, joinRoomId);
          break;
        }

        case "searchRoom": {
          const waitingConnIds = Array.from(connections.keys()).filter(
            (id) => id !== connId && connections.get(id)?.roomId === undefined
          );

          if (waitingConnIds.length > 0) {
            const waitingConnId = waitingConnIds[0];
            const waitingConn = connections.get(waitingConnId)!;
            const roomId = crypto.randomUUID().slice(0, 7);

            conn.roomId = roomId;
            waitingConn.roomId = roomId;

            addConnectionToRoom(connId, roomId);
            addConnectionToRoom(waitingConnId, roomId);

            broadcastToRoom(roomId, { type: "findRoom", payload: { id: roomId } });
          }
          break;
        }

        case "playWithFriend": {
          const { roomId: pwfRoomId } = payload;
          const existing = Array.from(connections.values()).find(
            (c) => c.roomId === pwfRoomId && c.id !== connId
          );

          if (existing) {
            conn.roomId = pwfRoomId;
            existing.roomId = pwfRoomId;

            addConnectionToRoom(connId, pwfRoomId);
            addConnectionToRoom(existing.id, pwfRoomId);

            broadcastToRoom(pwfRoomId, { type: "findRoom", payload: { id: pwfRoomId } });
          } else {
            conn.roomId = pwfRoomId;
          }
          break;
        }
      }
    } catch (e) {
      console.error("Error handling message:", e);
    }
  });

  ws.addEventListener("close", () => {
    console.log(`Client disconnected: ${connId}`);

    if (conn.roomId) {
      removeConnectionFromRoom(connId, conn.roomId);
    }

    if (conn.sessionId) {
      players.delete(conn.sessionId);
      sessionByConnection.delete(connId);
    }

    connections.delete(connId);
    wsClients.delete(connId);
  });

  return new Response(null, { status: 101, webSocket: server as unknown as WebSocket });
});

export default app;