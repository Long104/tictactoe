import { renderHook, act } from "@testing-library/react";
import { useGameEngine } from "@/hooks/game/useGameEngine";
import { checkWin, isValidMove, makeMove } from "@/domain/game/GameEngine";

describe("useGameEngine", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with empty board", () => {
      const { result } = renderHook(() => useGameEngine());

      expect(result.current.board).toEqual(Array(9).fill(""));
      expect(result.current.board.length).toBe(9);
    });

    it("should initialize with X as current player", () => {
      const { result } = renderHook(() => useGameEngine());

      expect(result.current.currentPlayer).toBe("X");
    });

    it("should initialize with no game status", () => {
      const { result } = renderHook(() => useGameEngine());

      expect(result.current.gameStatus).toBeNull();
    });

    it("should initialize with zero scores", () => {
      const { result } = renderHook(() => useGameEngine());

      expect(result.current.scores).toEqual({ xScore: 0, oScore: 0 });
    });
  });

  describe("handleMove", () => {
    it("should make move and update board state", () => {
      const { result } = renderHook(() => useGameEngine());

      act(() => {
        result.current.handleMove(0);
      });

      expect(result.current.board[0]).toBe("X");
      expect(result.current.board).toEqual([
        "X", "", "", "", "", "", "", "", ""
      ]);
    });

    it("should switch current player after move", () => {
      const { result } = renderHook(() => useGameEngine());

      expect(result.current.currentPlayer).toBe("X");

      act(() => {
        result.current.handleMove(0);
      });

      expect(result.current.currentPlayer).toBe("O");
    });

    it("should not allow move to occupied position", () => {
      const { result } = renderHook(() => useGameEngine());

      const boardBefore = [...result.current.board];
      
      act(() => {
        result.current.handleMove(0); // Place X at position 0
        result.current.handleMove(0); // Try to place O at same position
      });

      // Board should only have first move
      expect(result.current.board).toEqual(boardBefore);
      expect(result.current.board[0]).toBe("X");
    });

    it("should not allow move when game is over", () => {
      const { result } = renderHook(() => useGameEngine());

      // Make X win
      act(() => {
        result.current.handleMove(0);
        result.current.handleMove(1);
        result.current.handleMove(2);
      });

      expect(result.current.gameStatus).toBe("X");

      const boardBefore = [...result.current.board];
      
      // Try to make another move
      act(() => {
        result.current.handleMove(3);
      });

      // Board should not change
      expect(result.current.board).toEqual(boardBefore);
    });

    it("should not allow invalid position (out of bounds)", () => {
      const { result } = renderHook(() => useGameEngine());

      const boardBefore = [...result.current.board];
      
      act(() => {
        result.current.handleMove(-1); // Invalid position
      });

      expect(result.current.board).toEqual(boardBefore);
    });
  });

  describe("Win Detection", () => {
    it("should detect X winning and update score", () => {
      const { result } = renderHook(() => useGameEngine());

      // X wins with top row
      act(() => {
        result.current.handleMove(0); // X
        result.current.handleMove(3); // O
        result.current.handleMove(1); // X
        result.current.handleMove(4); // O
        result.current.handleMove(2); // X wins!
      });

      expect(result.current.gameStatus).toBe("X");
      expect(result.current.scores.xScore).toBe(1);
      expect(result.current.scores.oScore).toBe(0);
    });

    it("should detect O winning and update score", () => {
      const { result } = renderHook(() => useGameEngine());

      // O wins with left column
      act(() => {
        result.current.handleMove(0); // X
        result.current.handleMove(3); // O
        result.current.handleMove(1); // X
        result.current.handleMove(6); // O
        result.current.handleMove(2); // X
        result.current.handleMove(9); // O wins!
      });

      expect(result.current.gameStatus).toBe("O");
      expect(result.current.scores.xScore).toBe(0);
      expect(result.current.scores.oScore).toBe(1);
    });

    it("should detect draw and not update scores", () => {
      const { result } = renderHook(() => useGameEngine());

      // Play to a draw
      act(() => {
        result.current.handleMove(0); // X
        result.current.handleMove(4); // O
        result.current.handleMove(1); // X
        result.current.handleMove(2); // O
        result.current.handleMove(5); // X
        result.current.handleMove(3); // O
        result.current.handleMove(6); // X
        result.current.handleMove(7); // O
        result.current.handleMove(8); // X - draw!
      });

      expect(result.current.gameStatus).toBe("Draw");
      expect(result.current.scores.xScore).toBe(0);
      expect(result.current.scores.oScore).toBe(0);
    });

    it("should set game status when X wins diagonally", () => {
      const { result } = renderHook(() => useGameEngine());

      act(() => {
        result.current.handleMove(0); // X
        result.current.handleMove(4); // O
        result.current.handleMove(8); // X
        result.current.handleMove(2); // O
        result.current.handleMove(5); // X
        result.current.handleMove(7); // O
        result.current.handleMove(4); // X wins!
      });

      expect(result.current.gameStatus).toBe("X");
    });
  });

  describe("resetGame", () => {
    it("should reset board to empty", () => {
      const { result } = renderHook(() => useGameEngine());

      // Make some moves
      act(() => {
        result.current.handleMove(0);
        result.current.handleMove(4);
      });

      expect(result.current.board[0]).toBe("X");
      expect(result.current.board[4]).toBe("O");

      // Reset game
      act(() => {
        result.current.resetGame();
      });

      expect(result.current.board).toEqual(Array(9).fill(""));
    });

    it("should reset game status to null", () => {
      const { result } = renderHook(() => useGameEngine());

      // Make X win
      act(() => {
        result.current.handleMove(0);
        result.current.handleMove(1);
        result.current.handleMove(2);
      });

      expect(result.current.gameStatus).toBe("X");

      // Reset game
      act(() => {
        result.current.resetGame();
      });

      expect(result.current.gameStatus).toBeNull();
    });

    it("should reset current player to X", () => {
      const { result } = renderHook(() => useGameEngine());

      // Make some moves
      act(() => {
        result.current.handleMove(0);
        result.current.handleMove(4);
        result.current.handleMove(1);
      });

      expect(result.current.currentPlayer).toBe("O");

      // Reset game
      act(() => {
        result.current.resetGame();
      });

      expect(result.current.currentPlayer).toBe("X");
    });

    it("should not reset scores", () => {
      const { result } = renderHook(() => useGameEngine());

      // Make X win to increase score
      act(() => {
        result.current.handleMove(0);
        result.current.handleMove(1);
        result.current.handleMove(2);
      });

      expect(result.current.scores.xScore).toBe(1);

      // Reset game only (not score)
      act(() => {
        result.current.resetGame();
      });

      expect(result.current.scores.xScore).toBe(1);
    });
  });

  describe("resetScore", () => {
    it("should reset X score to zero", () => {
      const { result } = renderHook(() => useGameEngine());

      // Make X win twice
      act(() => {
        result.current.handleMove(0);
        result.current.handleMove(1);
        result.current.handleMove(2);
        result.current.resetGame();
        result.current.handleMove(0);
        result.current.handleMove(1);
        result.current.handleMove(2);
      });

      expect(result.current.scores.xScore).toBe(2);

      // Reset scores
      act(() => {
        result.current.resetScore();
      });

      expect(result.current.scores.xScore).toBe(0);
    });

    it("should reset O score to zero", () => {
      const { result } = renderHook(() => useGameEngine());

      // Make O win once
      act(() => {
        result.current.handleMove(4);
        result.current.handleMove(0);
        result.current.handleMove(1);
        result.current.handleMove(2);
        result.current.handleMove(5);
        result.current.handleMove(3);
        result.current.handleMove(6);
      });

      expect(result.current.scores.oScore).toBe(1);

      // Reset scores
      act(() => {
        result.current.resetScore();
      });

      expect(result.current.scores.oScore).toBe(0);
    });

    it("should reset both scores simultaneously", () => {
      const { result } = renderHook(() => useGameEngine());

      // Set some scores
      act(() => {
        result.current.handleMove(0);
        result.current.handleMove(1);
        result.current.handleMove(2);
        result.current.resetGame();
        result.current.handleMove(4);
        result.current.handleMove(0);
        result.current.handleMove(1);
        result.current.handleMove(2);
      });

      expect(result.current.scores).toEqual({ xScore: 2, oScore: 2 });

      // Reset scores
      act(() => {
        result.current.resetScore();
      });

      expect(result.current.scores).toEqual({ xScore: 0, oScore: 0 });
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete game flow with X winning", () => {
      const { result } = renderHook(() => useGameEngine());

      // Play a complete game
      act(() => {
        result.current.handleMove(0); // X at 0
        result.current.handleMove(4); // O at 4
        result.current.handleMove(1); // X at 1
        result.current.handleMove(2); // O at 2
        result.current.handleMove(5); // X at 5
        result.current.handleMove(3); // O at 3
        result.current.handleMove(6); // X at 6
      });

      expect(result.current.gameStatus).toBe("X");
      expect(result.current.scores.xScore).toBe(1);
      expect(result.current.scores.oScore).toBe(0);
      expect(result.current.currentPlayer).toBe("O"); // Next player would be O
    });

    it("should allow playing multiple games in a row", () => {
      const { result } = renderHook(() => useGameEngine());

      // First game - X wins
      act(() => {
        result.current.handleMove(0);
        result.current.handleMove(4);
        result.current.handleMove(1);
      });

      expect(result.current.scores.xScore).toBe(1);
      expect(result.current.gameStatus).toBe("X");

      // Reset and start second game
      act(() => {
        result.current.resetGame();
        result.current.handleMove(4);
        result.current.handleMove(0);
        result.current.handleMove(1);
      });

      expect(result.current.scores.xScore).toBe(2);
      expect(result.current.gameStatus).toBe("X");

      // Third game - draw
      act(() => {
        result.current.resetGame();
        result.current.handleMove(2);
        result.current.handleMove(3);
        result.current.handleMove(4);
        result.current.handleMove(5);
        result.current.handleMove(6);
        result.current.handleMove(7);
        result.current.handleMove(8);
        result.current.handleMove(0);
      });

      expect(result.current.scores.xScore).toBe(2); // Score unchanged
      expect(result.current.gameStatus).toBe("Draw");

      // Reset scores
      act(() => {
        result.current.resetScore();
      });

      expect(result.current.scores.xScore).toBe(0);
      expect(result.current.scores.oScore).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid consecutive moves", () => {
      const { result } = renderHook(() => useGameEngine());

      act(() => {
        result.current.handleMove(0);
        result.current.handleMove(4);
        result.current.handleMove(1);
        result.current.handleMove(5);
        result.current.handleMove(2);
      });

      expect(result.current.board.filter(cell => cell !== "").length).toBe(5);
      expect(result.current.currentPlayer).toBe("O");
    });

    it("should handle game with alternating moves", () => {
      const { result } = renderHook(() => useGameEngine());

      // Perfect alternating sequence
      act(() => {
        result.current.handleMove(0); // X
        result.current.handleMove(4); // O
        result.current.handleMove(1); // X
        result.current.handleMove(5); // O
        result.current.handleMove(2); // X
        result.current.handleMove(3); // O
      });

      const board = result.current.board;
      const xMoves = board.filter(cell => cell === "X").length;
      const oMoves = board.filter(cell => cell === "O").length;

      expect(xMoves).toBe(3);
      expect(oMoves).toBe(3);
      expect(xMoves).toEqual(oMoves);
    });
  });
});
