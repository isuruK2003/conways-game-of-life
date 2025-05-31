class Grid {
    constructor(rows, cols, cellWidth = 10, cellHeight = 10) {
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
        const newGrid = new Grid(this.rows, this.cols, this.cellWidth, this.cellHeight);
        newGrid.cells = [...this.cells];
        return newGrid;
    }

    clearGrid() {
        this.cells = new Array(this.rows * this.cols).fill(0);
    }
}

class GameOfLife {
    constructor(id, grid, frameIntervalMillis = 100) {
        this.grid = grid;
        this.lastUpdateTime = 0;
        this.frameInterval = frameIntervalMillis;
        this.animationId = null;
        this.canvas = document.getElementById(id);
        if (!this.canvas) {
            throw new Error("canvas element with canvas id=" + id + "can not be found");
        }
        this.canvas.width = this.grid.width;
        this.canvas.height = this.grid.height;
        this.ctx = this.canvas.getContext("2d");

        const handleMouseEvent = (event) => {
            const x = Math.floor((event.x) / this.grid.cellWidth);
            const y = Math.floor((event.y) / this.grid.cellHeight);
            this.grid.setCellState(x, y, 1);
            this.fillCell(x, y, "#fff");
        }

        let isMouseDown = false;
        window.addEventListener("mousedown", () => {
            isMouseDown = true;
        });
        window.addEventListener("mouseup", () => {
            isMouseDown = false;
        });
        this.canvas.addEventListener("mousedown", (event) => {
            handleMouseEvent(event);
        });
        this.canvas.addEventListener("mousemove", (event) => {
            if (isMouseDown) {
                handleMouseEvent(event);
            }
        });
        this.drawGridLines();
    }

    fillCell(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * this.grid.cellWidth,
            y * this.grid.cellHeight,
            this.grid.cellWidth,
            this.grid.cellHeight
        );
    }

    drawGridLines() {
        this.ctx.strokeStyle = "#444";
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x <= this.grid.width; x += this.grid.cellWidth) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.grid.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.grid.height; y += this.grid.cellHeight) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.grid.width, y);
            this.ctx.stroke();
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.grid.width, this.grid.height);
    }

    reset() {
        this.cancelRender();
        this.grid.clearGrid();
        this.clearCanvas();
        this.drawGridLines();
    }

    renderFrame() {
        this.clearCanvas();
        const newGrid = this.grid.getClone();
        for (let i = 0; i < this.grid.rows * this.grid.cols; i++) {
            const x = i % this.grid.cols;
            const y = Math.floor(i / this.grid.cols);

            let n = 0;
            for (let dx of [-1, 0, 1]) {
                for (let dy of [-1, 0, 1]) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = (x + dx) % this.grid.cols;
                    const ny = (y + dy) % this.grid.rows;
                    if (this.grid.getCellState(nx, ny) === 1) n++;
                }
            }

            const state = this.grid.getCellState(x, y);

            if (state === 1) {
                this.fillCell(x, y, "#fff");
                if (n < 2 || n > 3) newGrid.setCellState(x, y, 0);
            } else {
                this.fillCell(x, y, "#000");
                if (n === 3) newGrid.setCellState(x, y, 1);
            }
        }
        this.drawGridLines();
        this.grid = newGrid;
    }

    render(timestamp) {
        if (timestamp - this.lastUpdateTime >= this.frameInterval) {
            this.lastUpdateTime = timestamp;
            this.renderFrame();
        }
        this.animationId = requestAnimationFrame((ts) => this.render(ts));  // store animation ID
    }

    cancelRender() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

function main() {

    const cellSize = 10;
    const cols = Math.floor(window.innerWidth / cellSize)
    const rows = Math.floor(window.innerHeight / cellSize)
    const grid = new Grid(rows, cols, cellSize, cellSize);
    const game = new GameOfLife("canvas", grid);

    document.getElementById("startButton").addEventListener("click", () => {
        game.render();
    });

    document.getElementById("pauseButton").addEventListener("click", () => {
        game.cancelRender();
    });

    document.getElementById("resetButton").addEventListener("click", () => {
        game.reset();
    });
}

window.addEventListener("DOMContentLoaded", main)