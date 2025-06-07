export class CellGrid {
    constructor(rows, cols, cellWidth, cellHeight) {
        this.rows = rows;
        this.cols = cols;
        this.cells = new Array(rows * cols).fill(0);
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.width = this.cellWidth * cols;
        this.height = this.cellHeight * rows;
    }

    getCellState(x, y) {
        return this.cells[y * this.cols + x]
    }

    setCellState(x, y, state) {
        this.cells[y * this.cols + x] = state;
    }

    getClone() {
        const newGrid = new CellGrid(this.rows, this.cols, this.cellWidth, this.cellHeight);
        newGrid.cells = [...this.cells];
        return newGrid;
    }

    clearGrid() {
        this.cells = new Array(this.rows * this.cols).fill(0);
    }
}