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
}

class GameOfLife {
    constructor(id, grid) {
        this.grid = grid;
        this.lastUpdateTime = 0;
        this.frameInterval = 100;
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

    clearGrid() {
        this.ctx.clearRect(0, 0, this.grid.width, this.grid.height);
    }

    renderFrame() {
        this.clearGrid();
        const newGrid = this.grid.getClone();
        for (let i = 0; i < this.grid.rows * this.grid.cols; i++) {
            const x = i % this.grid.cols;
            const y = Math.floor(i / this.grid.cols);

            let n = 0;
            for (let dx of [-1, 0, 1]) {
                for (let dy of [-1, 0, 1]) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < this.grid.cols && ny >= 0 && ny < this.grid.rows) {
                        if (this.grid.getCellState(nx, ny) === 1) n++;
                    }
                }
            }

            const state = this.grid.getCellState(x, y);

            if (state === 1) {
                this.fillCell(x, y, "#fff");
                if (n < 2 || n > 3) newGrid.setCellState(x, y, 0);
            } else if (n === 3) {
                newGrid.setCellState(x, y, 1);
            }
        }
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
        cancelAnimationFrame(this.animationId);
        if (this.animationId !== null) {
            this.animationId = null;
        }
    }
}


function main() {
    const cellSize = 10;
    const rows = Math.floor(window.innerHeight / cellSize)
    const cols = Math.floor(window.innerWidth / cellSize)
    const grid = new Grid(rows, cols, cellSize, cellSize);
    const game = new GameOfLife("canvas", grid);
    document.getElementById("startButton").addEventListener("click", () => {
        game.render();
    });
    document.getElementById("stopButton").addEventListener("click", () => {
        game.cancelRender();
    });
}

window.addEventListener("DOMContentLoaded", () => {
    main()
})