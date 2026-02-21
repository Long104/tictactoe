import { checkWin, isValidMove, makeMove, getCurrentPlayer, getValidMoves } from "@/domain/game/GameEngine";

describe("GameEngine", () => {
  describe("checkWin", () => {
    it("should detect X winning horizontally", () => {
      const board = ["X", "X", "X", "", "", "", "", "", ""];
      expect(checkWin(board)).toBe("X");
    });

    it("should detect O winning horizontally", () => {
      const board = ["", "", "", "O", "O", "O", "", "", ""];
      expect(checkWin(board)).toBe("O");
    });

    it("should detect X winning vertically", () => {
      const board = ["X", "", "", "X", "", "", "X", "", ""];
      expect(checkWin(board)).toBe("X");
    });

    it("should detect O winning vertically", () => {
      const board = ["", "O", "", "", "O", "", "", "O"];
      expect(checkWin(board)).toBe("O");
    });

    it("should detect X winning diagonally (top-left to bottom-right)", () => {
      const board = ["X", "", "", "", "X", "", "", "", "X"];
      expect(checkWin(board)).toBe("X");
    });

    it("should detect O winning diagonally (top-right to bottom-left)", () => {
      const board = ["", "", "O", "", "O", "", "O", ""];
      expect(checkWin(board)).toBe("O");
    });

    it("should detect draw when board is full with no winner", () => {
      const board = ["X", "O", "X", "X", "X", "O", "O", "X", "O"];
      expect(checkWin(board)).toBe("Draw");
    });

    it("should return null for ongoing game", () => {
      const board = ["X", "O", "", "", "", "", "", "", ""];
      expect(checkWin(board)).toBeNull();
    });

    it("should return null for empty board", () => {
      const board = Array(9).fill("");
      expect(checkWin(board)).toBeNull();
    });
  });

  describe("isValidMove", () => {
    it("should validate empty positions on empty board", () => {
      const board = Array(9).fill("");
      expect(isValidMove(board, 0)).toBe(true);
      expect(isValidMove(board, 4)).toBe(true);
      expect(isValidMove(board, 8)).toBe(true);
    });

    it("should validate empty positions on partially filled board", () => {
      const board = ["X", "", "X", "", "", "", "", ""];
      expect(isValidMove(board, 1)).toBe(true);
      expect(isValidMove(board, 7)).toBe(true);
    });

    it("should reject occupied positions", () => {
      const board = ["X", "", "", "", "", "", "", ""];
      expect(isValidMove(board, 0)).toBe(false);
    });

    it("should reject positions out of bounds (negative)", () => {
      const board = Array(9).fill("");
      expect(isValidMove(board, -1)).toBe(false);
      expect(isValidMove(board, -5)).toBe(false);
    });

    it("should reject positions out of bounds (too high)", () => {
      const board = Array(9).fill("");
      expect(isValidMove(board, 9)).toBe(false);
      expect(isValidMove(board, 10)).toBe(false);
      expect(isValidMove(board, 100)).toBe(false);
    });
  });

  describe("makeMove", () => {
    it("should create new board with X move at position 0", () => {
      const board = Array(9).fill("");
      const newBoard = makeMove(board, 0, "X");

      expect(newBoard).not.toBe(board);
      expect(newBoard[0]).toBe("X");
      expect(board[0]).toBe(""); // Original unchanged
    });

    it("should create new board with O move at position 4", () => {
      const board = Array(9).fill("");
      const newBoard = makeMove(board, 4, "O");

      expect(newBoard[4]).toBe("O");
      expect(board[4]).toBe(""); // Original unchanged
    });

    it("should not modify board for invalid move", () => {
      const board = ["X", "", "", "", "", "", "", ""];
      const newBoard = makeMove(board, 0, "O");

      expect(newBoard).toEqual(board); // Unchanged
      expect(newBoard[0]).toBe("X"); // Still X
    });

    it("should work with multiple moves", () => {
      let board = Array(9).fill("");
      board = makeMove(board, 0, "X");
      board = makeMove(board, 4, "O");
      board = makeMove(board, 1, "X");

      expect(board[0]).toBe("X");
      expect(board[1]).toBe("X");
      expect(board[4]).toBe("O");
    });
  });

  describe("getCurrentPlayer", () => {
    it("should return X for empty board", () => {
      const board = Array(9).fill("");
      expect(getCurrentPlayer(board)).toBe("X");
    });

    it("should return O after X makes first move", () => {
      const board = ["X", "", "", "", "", "", "", ""];
      expect(getCurrentPlayer(board)).toBe("O");
    });

    it("should return X after X and O have made one move each", () => {
      const board = ["X", "O", "X", "", "", "", ""];
      expect(getCurrentPlayer(board)).toBe("X");
    });

    it("should return O when O and X have equal moves", () => {
      const board = ["O", "X", "O", "X", "", "", "", ""];
      expect(getCurrentPlayer(board)).toBe("O");
    });
  });

  describe("getValidMoves", () => {
    it("should return all positions for empty board", () => {
      const board = Array(9).fill("");
      const validMoves = getValidMoves(board);

      expect(validMoves).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("should return only empty positions for partially filled board", () => {
      const board = ["X", "", "X", "", "", "", "", ""];
      const validMoves = getValidMoves(board);

      expect(validMoves).toEqual([1, 3, 4, 5, 6, 7, 8]);
      expect(validMoves).not.toContain(0);
      expect(validMoves).not.toContain(2);
    });

    it("should return empty array for full board", () => {
      const board = ["X", "O", "X", "X", "X", "O", "O", "X", "O"];
      const validMoves = getValidMoves(board);

      expect(validMoves).toEqual([]);
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete game with X winning", () => {
      let board = Array(9).fill("");
      
      // X wins
      board = makeMove(board, 0, "X"); // X: 0
      board = makeMove(board, 3, "O"); // O: 4
      board = makeMove(board, 1, "X"); // X: 1
      board = makeMove(board, 4, "O"); // O: 4
      board = makeMove(board, 2, "X"); // X: 2 - X wins!
      
      expect(checkWin(board)).toBe("X");
    });

    it("should handle complete game with draw", () => {
      let board = Array(9).fill("");
      
      // Play out to a draw
      board = makeMove(board, 0, "X");
      board = makeMove(board, 4, "O");
      board = makeMove(board, 1, "X");
      board = makeMove(board, 2, "O");
      board = makeMove(board, 5, "X");
      board = makeMove(board, 3, "O");
      board = makeMove(board, 6, "X");
      board = makeMove(board, 7, "O");
      board = makeMove(board, 8, "X");
      
      expect(checkWin(board)).toBe("Draw");
      expect(getValidMoves(board)).toEqual([]);
    });

    it("should validate that only valid moves are allowed", () => {
      const board = ["X", "", "", "", "", "", "", ""];
      
      // Valid move
      expect(isValidMove(board, 1)).toBe(true);
      
      // Invalid move (position 0 is occupied)
      expect(isValidMove(board, 0)).toBe(false);
      
      // Invalid move (out of bounds)
      expect(isValidMove(board, -1)).toBe(false);
      expect(isValidMove(board, 9)).toBe(false);
    });
  });
});
