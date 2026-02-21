import { GameEngine } from "@/domain/game/GameEngine";

describe("GameEngine", () => {
  let gameEngine: GameEngine;

  beforeEach(() => {
    gameEngine = new GameEngine();
  });

  describe("validateMove", () => {
    it("should validate legal moves for X on empty board", () => {
      const board = Array(9).fill("");
      expect(gameEngine.validateMove(board, 0, "X")).toBe(true);
      expect(gameEngine.validateMove(board, 4, "X")).toBe(true);
      expect(gameEngine.validateMove(board, 8, "X")).toBe(true);
    });

    it("should validate legal moves for O on empty board", () => {
      const board = Array(9).fill("");
      expect(gameEngine.validateMove(board, 1, "O")).toBe(true);
      expect(gameEngine.validateMove(board, 5, "O")).toBe(true);
      expect(gameEngine.validateMove(board, 7, "O")).toBe(true);
    });

    it("should reject occupied positions", () => {
      const board = ["X", "", "", "", "", "", "", "", ""];
      expect(gameEngine.validateMove(board, 0, "O")).toBe(false);
      expect(gameEngine.validateMove(board, 0, "X")).toBe(false);
    });

    it("should reject positions out of bounds (negative)", () => {
      const board = Array(9).fill("");
      expect(gameEngine.validateMove(board, -1, "X")).toBe(false);
      expect(gameEngine.validateMove(board, -5, "O")).toBe(false);
    });

    it("should reject positions out of bounds (too high)", () => {
      const board = Array(9).fill("");
      expect(gameEngine.validateMove(board, 9, "X")).toBe(false);
      expect(gameEngine.validateMove(board, 10, "O")).toBe(false);
      expect(gameEngine.validateMove(board, 100, "X")).toBe(false);
    });

    it("should reject wrong player's turn", () => {
      const board = ["X", "", "", "", "", "", "", "", ""];
      // X just moved, so it's O's turn
      expect(gameEngine.validateMove(board, 4, "X")).toBe(false);
    });

    it("should validate when O's turn", () => {
      const board = ["X", "", "", "", "", "", "", "", ""];
      expect(gameEngine.validateMove(board, 4, "O")).toBe(true);
      expect(gameEngine.validateMove(board, 1, "O")).toBe(true);
    });

    it("should validate when X's turn", () => {
      const board = Array(9).fill("");
      // Empty board, X goes first
      expect(gameEngine.validateMove(board, 0, "X")).toBe(true);
      expect(gameEngine.validateMove(board, 8, "X")).toBe(true);
    });
  });

  describe("executeMove", () => {
    it("should create new board with X move at position 0", () => {
      const board = Array(9).fill("");
      const newBoard = gameEngine.executeMove(board, 0, "X");

      expect(newBoard[0]).toBe("X");
      expect(board[0]).toBe(""); // Original unchanged
      expect(newBoard).not.toBe(board);
    });

    it("should create new board with O move at position 4", () => {
      const board = Array(9).fill("");
      const newBoard = gameEngine.executeMove(board, 4, "O");

      expect(newBoard[4]).toBe("O");
      expect(board[4]).toBe(""); // Original unchanged
    });

    it("should throw error for invalid move (occupied position)", () => {
      const board = ["X", "", "", "", "", "", "", "", ""];
      
      expect(() => {
        gameEngine.executeMove(board, 0, "O");
      }).toThrow("Invalid move");
    });

    it("should throw error for invalid move (out of bounds)", () => {
      const board = Array(9).fill("");
      
      expect(() => {
        gameEngine.executeMove(board, -1, "X");
      }).toThrow("Invalid move");
    });

    it("should throw error for invalid move (wrong player's turn)", () => {
      const board = ["X", "", "", "", "", "", "", "", ""];
      
      expect(() => {
        gameEngine.executeMove(board, 4, "X");
      }).toThrow("Invalid move");
    });
  });

  describe("checkWin", () => {
    it("should detect X winning horizontally (top row)", () => {
      const board = ["X", "X", "X", "", "", "", "", "", ""];
      expect(gameEngine.checkWin(board)).toBe("X");
    });

    it("should detect X winning horizontally (middle row)", () => {
      const board = ["", "", "", "X", "X", "X", "", "", ""];
      expect(gameEngine.checkWin(board)).toBe("X");
    });

    it("should detect X winning horizontally (bottom row)", () => {
      const board = ["", "", "", "", "", "", "X", "X", "X"];
      expect(gameEngine.checkWin(board)).toBe("X");
    });

    it("should detect O winning vertically (left column)", () => {
      const board = ["O", "", "O", "", "", "O", "", ""];
      expect(gameEngine.checkWin(board)).toBe("O");
    });

    it("should detect O winning vertically (middle column)", () => {
      const board = ["", "O", "", "O", "", "O", "", ""];
      expect(gameEngine.checkWin(board)).toBe("O");
    });

    it("should detect O winning vertically (right column)", () => {
      const board = ["", "", "O", "", "O", "", "O"];
      expect(gameEngine.checkWin(board)).toBe("O");
    });

    it("should detect X winning diagonally (top-left to bottom-right)", () => {
      const board = ["X", "", "", "", "X", "", "", "", "X"];
      expect(gameEngine.checkWin(board)).toBe("X");
    });

    it("should detect O winning diagonally (top-right to bottom-left)", () => {
      const board = ["", "", "O", "", "O", "", "O"];
      expect(gameEngine.checkWin(board)).toBe("O");
    });

    it("should detect draw when board is full with no winner", () => {
      const board = ["X", "O", "X", "X", "X", "O", "O", "X", "O"];
      expect(gameEngine.checkWin(board)).toBe("Draw");
    });

    it("should detect draw with alternating pattern", () => {
      const board = ["O", "X", "O", "X", "X", "O", "O", "X", "O"];
      expect(gameEngine.checkWin(board)).toBe("Draw");
    });

    it("should return null for ongoing game", () => {
      const board = ["X", "O", "", "", "", "", "", ""];
      expect(gameEngine.checkWin(board)).toBeNull();
    });

    it("should return null for empty board", () => {
      const board = Array(9).fill("");
      expect(gameEngine.checkWin(board)).toBeNull();
    });

    it("should return null for board with only X moves", () => {
      const board = ["X", "O", "X", "", "", "", "", ""];
      expect(gameEngine.checkWin(board)).toBeNull();
    });
  });

  describe("getCurrentPlayer", () => {
    it("should return X for empty board", () => {
      const board = Array(9).fill("");
      expect(gameEngine.getCurrentPlayer(board)).toBe("X");
    });

    it("should return O after X makes first move", () => {
      const board = ["X", "", "", "", "", "", "", ""];
      expect(gameEngine.getCurrentPlayer(board)).toBe("O");
    });

    it("should return X after X and O have made one move each", () => {
      const board = ["X", "O", "X", "", "", "", "", ""];
      expect(gameEngine.getCurrentPlayer(board)).toBe("X");
    });

    it("should return O when O and X have equal moves", () => {
      const board = ["O", "X", "O", "X", "", "", "", ""];
      expect(gameEngine.getCurrentPlayer(board)).toBe("O");
    });

    it("should return X when X has more moves", () => {
      const board = ["X", "O", "X", "O", "X", "", "", ""];
      expect(gameEngine.getCurrentPlayer(board)).toBe("O");
    });

    it("should return O when O has more moves", () => {
      const board = ["X", "O", "X", "O", "X", "O", "", ""];
      expect(gameEngine.getCurrentPlayer(board)).toBe("X");
    });
  });

  describe("Integration: Complete Game Flow", () => {
    it("should handle complete game with X winning (horizontal)", () => {
      let board = Array(9).fill("");
      
      // X wins: 0, 1, 2
      board = gameEngine.executeMove(board, 0, "X");
      board = gameEngine.executeMove(board, 4, "O");
      board = gameEngine.executeMove(board, 1, "X");
      board = gameEngine.executeMove(board, 5, "O");
      board = gameEngine.executeMove(board, 2, "X");
      
      expect(gameEngine.checkWin(board)).toBe("X");
    });

    it("should handle complete game with O winning (diagonal)", () => {
      let board = Array(9).fill("");
      
      // O wins: 6, 4, 2
      board = gameEngine.executeMove(board, 6, "O");
      board = gameEngine.executeMove(board, 0, "X");
      board = gameEngine.executeMove(board, 4, "O");
      board = gameEngine.executeMove(board, 1, "X");
      board = gameEngine.executeMove(board, 2, "O");
      
      expect(gameEngine.checkWin(board)).toBe("O");
    });

    it("should handle complete game with draw", () => {
      let board = Array(9).fill("");
      
      // Draw pattern: X, O, X, O, X, O, X, O, X
      board = gameEngine.executeMove(board, 0, "X");
      board = gameEngine.executeMove(board, 4, "O");
      board = gameEngine.executeMove(board, 1, "X");
      board = gameEngine.executeMove(board, 5, "O");
      board = gameEngine.executeMove(board, 2, "X");
      board = gameEngine.executeMove(board, 3, "O");
      board = gameEngine.executeMove(board, 6, "X");
      board = gameEngine.executeMove(board, 7, "O");
      board = gameEngine.executeMove(board, 8, "X");
      
      expect(gameEngine.checkWin(board)).toBe("Draw");
    });

    it("should validate that only valid moves are allowed", () => {
      const board = ["X", "", "", "", "", "", "", ""];
      
      // Invalid: position 0 is occupied
      expect(gameEngine.validateMove(board, 0, "O")).toBe(false);
      
      // Valid: position 4 is empty
      expect(gameEngine.validateMove(board, 4, "O")).toBe(true);
    });
  });
});
