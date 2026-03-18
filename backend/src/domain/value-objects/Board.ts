export type CellValue = "" | "X" | "O";

export interface Board {
  cells: CellValue[];
  size: number;
}

export function createEmptyBoard(): Board {
  return {
    cells: Array(9).fill(""),
    size: 3,
  };
}

export function boardToArray(board: Board): string[] {
  return [...board.cells];
}

export function arrayToBoard(cells: string[]): Board {
  return {
    cells: cells,
    size: 3,
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
  return { ...board, cells: newCells };
}