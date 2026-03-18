export type CellValue = "" | "X" | "O";

export interface Board {
  cells: CellValue[];
}

export function createEmptyBoard(): Board {
  return {
    cells: Array(9).fill(""),
  };
}

export function isValidPosition(position: number): boolean {
  return position >= 0 && position < 9;
}

export function isCellEmpty(board: Board, position: number): boolean {
  return board.cells[position] === "";
}

export function placeMove(board: Board, position: number, value: "X" | "O"): Board {
  if (!isValidPosition(position) || !isCellEmpty(board, position)) {
    throw new Error("Invalid move");
  }
  const newCells = [...board.cells];
  newCells[position] = value;
  return { cells: newCells };
}