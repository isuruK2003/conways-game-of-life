export class CellGrid {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.cells = new Array(rows * cols).fill(0);
    }

    getCellState(x, y) {
        return this.cells[y * this.cols + x]
    }

    setCellState(x, y, state) {
        this.cells[y * this.cols + x] = state;
    }

    getClone() {
        const newGrid = new CellGrid(this.rows, this.cols);
        newGrid.cells = [...this.cells];
        return newGrid;
    }

    clearGrid() {
        this.cells = new Array(this.rows * this.cols).fill(0);
    }
}