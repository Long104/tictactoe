export type RoomState = {
  roomId: string;
  board: string[];
  score: { oScore: number; xScore: number };
  currentTurn: "X" | "O";
  gameStarted: boolean;
  createdAt: number;
};

export type PlayerState = {
  sessionId: string;
  socketId: string;
  roomId: string;
  name: string;
  role: "X" | "O";
  joinedAt: number;
};
