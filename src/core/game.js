export class GameOfLife {
    constructor(canvasGrid) {
        this.isPlaying = false;
        this.canvasGrid = canvasGrid;
        this.canvasGrid.onRenderFrame = (x, y, currentGrid, bufferGrid) => {
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

            if (state === 1 && n < 2 || n > 3) {
                bufferGrid.setCellState(x, y, 0);
            } else if (n === 3) {
                bufferGrid.setCellState(x, y, 1);
            }
        };
    }

    toggle() {
        this.isPlaying ? this.canvasGrid.cancelRender() : this.canvasGrid.render();
        this.isPlaying = !this.isPlaying;
    }

    toggleGridLines() {
        this.canvasGrid.gridLinesEnabled = !this.canvasGrid.gridLinesEnabled;
        !this.isPlaying && this.canvasGrid.renderFrame();
    }

    reset() {
        this.canvasGrid.cancelRender();
        this.canvasGrid.cellGrid.clearGrid();
        this.canvasGrid.clearCanvas();
        this.canvasGrid.renderGridLines();
        this.isPlaying = false;
    }
}