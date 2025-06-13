export class GameOfLife {
    constructor(gridRenderer) {
        this.isPlaying = false;
        this.gridRenderer = gridRenderer;
        this.gridRenderer.onRenderFrame = (x, y, currentGrid, bufferGrid) => {
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
        this.listeners = {
            togglePlaying: [],
            toggleGrid: [],
            reset: []
        };
    }

    addEventListener(event, callback) {
        this.listeners[event].push({ event: event, callback: callback });
    }

    updateEventListeners(event) {
        this.listeners[event].forEach((listener) => {
            listener.callback();
        });
    }

    togglePlaying() {
        this.isPlaying ? this.gridRenderer.cancelRender() : this.gridRenderer.render();
        this.isPlaying = !this.isPlaying;
        this.updateEventListeners("togglePlaying");
    }

    toggleGridLines() {
        this.gridRenderer.gridLinesEnabled = !this.gridRenderer.gridLinesEnabled;
        !this.isPlaying && this.gridRenderer.renderFrame();
        this.updateEventListeners("toggleGrid");
    }

    reset() {
        this.gridRenderer.cancelRender();
        this.gridRenderer.cellGrid.clearGrid();
        this.gridRenderer.clearCanvas();
        this.gridRenderer.renderGridLines();
        this.isPlaying = false;
        this.updateEventListeners("reset");
    }
}