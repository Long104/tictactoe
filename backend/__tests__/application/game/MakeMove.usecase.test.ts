import { MakeMoveUseCase } from "@/application/game/MakeMove.usecase";
import { GameEngine } from "@/domain/game/GameEngine";
import { InMemoryRoomRepository } from "@/adapters/storage/InMemoryRoomRepository";

describe("MakeMoveUseCase", () => {
  let useCase: MakeMoveUseCase;
  let roomRepository: InMemoryRoomRepository;

  beforeEach(() => {
    const gameEngine = new GameEngine();
    roomRepository = new InMemoryRoomRepository();
    useCase = new MakeMoveUseCase(gameEngine, roomRepository);
  });

  describe("execute", () => {
    beforeEach(async () => {
      // Create a room for each test
      await roomRepository.save({
        roomId: "test-room",
        board: Array(9).fill(""),
        currentTurn: "X",
        gameStarted: true,
        createdAt: Date.now(),
        score: { xScore: 0, oScore: 0 }
      });
    });

    afterEach(async () => {
      // Clean up
      await roomRepository.delete("test-room");
    });

    it("should make valid move for X", async () => {
      const dto = {
        roomId: "test-room",
        position: 0,
        player: "X",
        playerId: "player-1"
      };

      const result = await useCase.execute(dto);

      expect(result.board[0]).toBe("X");
      expect(result.currentTurn).toBe("O");
      expect(result.score.xScore).toBe(0);
      expect(result.score.oScore).toBe(0);
    });

    it("should make valid move for O", async () => {
      // Setup: X has made a move
      await roomRepository.update("test-room", {
        board: ["X", "", "", "", "", "", "", "", ""],
        currentTurn: "O"
      });

      const dto = {
        roomId: "test-room",
        position: 4,
        player: "O",
        playerId: "player-2"
      };

      const result = await useCase.execute(dto);

      expect(result.board[4]).toBe("O");
      expect(result.currentTurn).toBe("X");
    });

    it("should detect X winning and update score", async () => {
      // Setup: One move away from X win
      await roomRepository.update("test-room", {
        board: ["X", "X", "", "", "", "", "", "", ""],
        currentTurn: "O"
      });

      const dto = {
        roomId: "test-room",
        position: 2,
        player: "O",
        playerId: "player-2"
      };

      const result = await useCase.execute(dto);

      expect(result.board[2]).toBe("O");
      expect(result.gameStarted).toBe(true);
      expect(result.score.xScore).toBe(1);
      expect(result.score.oScore).toBe(0);
    });

    it("should detect O winning and update score", async () => {
      // Setup: One move away from O win
      await roomRepository.update("test-room", {
        board: ["", "O", "", "", "", "", "", "", ""],
        currentTurn: "X"
      });

      const dto = {
        roomId: "test-room",
        position: 7,
        player: "X",
        playerId: "player-1"
      };

      const result = await useCase.execute(dto);

      expect(result.board[7]).toBe("X");
      expect(result.score.xScore).toBe(0);
      expect(result.score.oScore).toBe(1);
    });

    it("should detect draw and not update scores", async () => {
      // Setup: One move away from draw
      await roomRepository.update("test-room", {
        board: ["X", "O", "X", "X", "X", "O", "O", "X"],
        currentTurn: "O"
      });

      const dto = {
        roomId: "test-room",
        position: 8,
        player: "O",
        playerId: "player-2"
      };

      const result = await useCase.execute(dto);

      expect(result.board[8]).toBe("O");
      expect(result.score.xScore).toBe(0);
      expect(result.score.oScore).toBe(0);
    });

    it("should throw error for non-existent room", async () => {
      await roomRepository.delete("test-room");

      const dto = {
        roomId: "test-room",
        position: 0,
        player: "X",
        playerId: "player-1"
      };

      await expect(useCase.execute(dto)).rejects.toThrow("Room not found");
    });

    it("should throw error for invalid move (occupied position)", async () => {
      const dto = {
        roomId: "test-room",
        position: 0, // Already occupied by X
        player: "O",
        playerId: "player-2"
      };

      await expect(useCase.execute(dto)).rejects.toThrow("Invalid move");
    });

    it("should throw error for invalid move (out of bounds)", async () => {
      const dto = {
        roomId: "test-room",
        position: -1,
        player: "X",
        playerId: "player-1"
      };

      await expect(useCase.execute(dto)).rejects.toThrow("Invalid move");
    });

    it("should throw error for wrong player's turn", async () => {
      // Setup: X just moved, it's O's turn
      await roomRepository.update("test-room", {
        board: ["X", "", "", "", "", "", "", "", ""],
        currentTurn: "O"
      });

      const dto = {
        roomId: "test-room",
        position: 4,
        player: "X", // Wrong! It's O's turn
        playerId: "player-1"
      };

      await expect(useCase.execute(dto)).rejects.toThrow("Invalid move");
    });
  });

  describe("Integration: Complete Game Flow", () => {
    it("should handle complete game with X winning", async () => {
      const dto = {
        roomId: "test-room",
        position: 0,
        player: "X",
        playerId: "player-1"
      };

      // Move 1: X at 0
      await useCase.execute(dto);
      let room = await roomRepository.findById("test-room");
      expect(room.score.xScore).toBe(0);

      // Move 2: O at 4
      await useCase.execute({
        ...dto,
        position: 4,
        player: "O",
        playerId: "player-2"
      });
      room = await roomRepository.findById("test-room");

      // Move 3: X at 1
      await useCase.execute({
        ...dto,
        position: 1,
        player: "X",
        playerId: "player-1"
      });
      room = await roomRepository.findById("test-room");

      // Move 4: O at 5
      await useCase.execute({
        ...dto,
        position: 5,
        player: "O",
        playerId: "player-2"
      });
      room = await roomRepository.findById("test-room");

      // Move 5: X at 2 - X wins!
      await useCase.execute({
        ...dto,
        position: 2,
        player: "X",
        playerId: "player-1"
      });
      room = await roomRepository.findById("test-room");

      expect(room.score.xScore).toBe(1);
      expect(room.score.oScore).toBe(0);
      expect(room.currentTurn).toBe("O");
    });

    it("should handle complete game with draw", async () => {
      const dto = {
        roomId: "test-room",
        position: 0,
        player: "X",
        playerId: "player-1"
      };

      // Play all 9 moves for a draw
      const moves = [
        { pos: 0, player: "X" },
        { pos: 4, player: "O" },
        { pos: 1, player: "X" },
        { pos: 5, player: "O" },
        { pos: 2, player: "X" },
        { pos: 3, player: "O" },
        { pos: 6, player: "X" },
        { pos: 7, player: "O" },
        { pos: 8, player: "X" }
      ];

      for (const move of moves) {
        await useCase.execute({
          roomId: "test-room",
          position: move.pos,
          player: move.player,
          playerId: move.player === "X" ? "player-1" : "player-2"
        });
      }

      const room = await roomRepository.findById("test-room");
      expect(room.board.every(cell => cell !== "")).toBe(true);
      expect(room.score.xScore).toBe(0);
      expect(room.score.oScore).toBe(0);
    });
  });

  describe("Score Management", () => {
    it("should increment X score on each X win", async () => {
      // First game: X wins
      for (let i = 0; i < 3; i++) {
        await useCase.execute({
          roomId: "test-room",
          position: i,
          player: "X",
          playerId: "player-1"
        });
        if (i < 2) {
          await useCase.execute({
            roomId: "test-room",
            position: i + 3,
            player: "O",
            playerId: "player-2"
          });
        }
      }
      await roomRepository.update("test-room", { board: Array(9).fill("") });

      let room = await roomRepository.findById("test-room");
      expect(room.score.xScore).toBe(1);

      // Second game: X wins again
      for (let i = 0; i < 3; i++) {
        await useCase.execute({
          roomId: "test-room",
          position: i,
          player: "X",
          playerId: "player-1"
        });
        if (i < 2) {
          await useCase.execute({
            roomId: "test-room",
            position: i + 3,
            player: "O",
            playerId: "player-2"
          });
        }
      }
      await roomRepository.update("test-room", { board: Array(9).fill("") });

      room = await roomRepository.findById("test-room");
      expect(room.score.xScore).toBe(2);
    });

    it("should not update score on draw", async () => {
      // Play a draw
      for (let i = 0; i < 9; i++) {
        const player = i % 2 === 0 ? "X" : "O";
        await useCase.execute({
          roomId: "test-room",
          position: i,
          player,
          playerId: player === "X" ? "player-1" : "player-2"
        });
      }

      const room = await roomRepository.findById("test-room");
      expect(room.score.xScore).toBe(0);
      expect(room.score.oScore).toBe(0);
    });
  });
});
