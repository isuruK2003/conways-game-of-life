export class GameOfLife {
    constructor(canvasGrid) {
        this.canvasGrid = canvasGrid;
        this.isPlaying = false;
        this.gridLinesEnabled = true;
        this.canvasGrid.setRenderFrame(() => {
            const currentGrid = this.canvasGrid.cellGrid;
            const newGrid = this.canvasGrid.cellGrid.getClone();
            for (let i = 0; i < currentGrid.rows * currentGrid.cols; i++) {
                const x = i % currentGrid.cols;
                const y = Math.floor(i / currentGrid.cols);

                let n = 0;
                for (let dx of [-1, 0, 1]) {
                    for (let dy of [-1, 0, 1]) {
                        if (dx === 0 && dy === 0) continue;
                        const nx = (x + dx + currentGrid.cols) % currentGrid.cols;
                        const ny = (y + dy + currentGrid.rows) % currentGrid.rows;
                        if (currentGrid.getCellState(nx, ny) === 1) n++;
                    }
                }

                const state = currentGrid.getCellState(x, y);

                if (state === 1) {
                    this.canvasGrid.fillCell(x, y, "#fff");
                    if (n < 2 || n > 3) newGrid.setCellState(x, y, 0);
                } else {
                    this.canvasGrid.fillCell(x, y, "#000");
                    if (n === 3) newGrid.setCellState(x, y, 1);
                }
            }
            this.canvasGrid.cellGrid = newGrid;
            this.gridLinesEnabled && this.canvasGrid.drawGridLines();
        });
    }

    toggle() {
        if (this.isPlaying) {
            this.canvasGrid.cancelRender();
        } else {
            this.canvasGrid.render();
        }
        this.isPlaying = !this.isPlaying;
    }

    toggleGridLines() {
        this.gridLinesEnabled = !this.gridLinesEnabled;
    }

    reset() {
        this.canvasGrid.cancelRender();
        this.canvasGrid.cellGrid.clearGrid();
        this.canvasGrid.clearCanvas();
        this.gridLinesEnabled && this.canvasGrid.drawGridLines();
        this.isPlaying = false;
    }
}