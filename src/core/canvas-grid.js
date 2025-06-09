import { CellGrid } from "./cell-grid.js";

export class CanvasGridRenderer {
    constructor(
        canvasId,
        rows,
        cols,
        cellWidth,
        cellHeight,
        frameIntervalMillis = 100,
        onRenderFrame = () => { }
    ) {
        this.frameInterval = frameIntervalMillis;
        this.lastUpdateTime = 0;
        this.animationId = null;
        this.onRenderFrame = onRenderFrame;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.canvas = document.getElementById(canvasId);
        this.cellGrid = new CellGrid(rows, cols);
        if (!this.canvas) {
            throw new Error("canvas element with canvas canvasId=" + canvasId + "can not be found");
        }
        const handleMouseEvent = (event) => {
            const x = Math.floor((event.x) / this.cellWidth);
            const y = Math.floor((event.y) / this.cellHeight);
            this.cellGrid.setCellState(x, y, 1);
            this.fillCell(x, y, "#fff");
        }
        let isMouseDown = false;
        window.addEventListener("mousedown", () => {
            isMouseDown = true;
        });
        window.addEventListener("mouseup", () => {
            isMouseDown = false;
            !this.animationId && this.renderFrame();
        });
        this.canvas.addEventListener("mousedown", (event) => {
            handleMouseEvent(event);
        });
        this.canvas.addEventListener("mousemove", (event) => {
            if (isMouseDown) {
                handleMouseEvent(event);
            }
        });
        this.gridLinesEnabled = true;

        this.width = this.cellWidth * cols;
        this.height = this.cellHeight * rows;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
        this.renderGridLines();
    }

    fillCell(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * this.cellWidth,
            y * this.cellHeight,
            this.cellWidth,
            this.cellHeight
        );
    }

    renderGridLines() {
        if (this.gridLinesEnabled) {
            this.ctx.strokeStyle = "#444";
            this.ctx.lineWidth = 0.5;

            for (let x = 0; x <= this.width; x += this.cellWidth) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.height);
                this.ctx.stroke();
            }

            for (let y = 0; y <= this.height; y += this.cellHeight) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.width, y);
                this.ctx.stroke();
            }
        }
    }

    renderFrame({ callback = () => { } } = {}) {
        const currentGrid = this.cellGrid;
        const bufferGrid = this.cellGrid.getClone();
        for (let i = 0; i < currentGrid.rows * currentGrid.cols; i++) {
            const x = i % currentGrid.cols;
            const y = Math.floor(i / currentGrid.cols);
            const color = currentGrid.getCellState(x, y) === 1 ? "#fff" : "#000";
            this.fillCell(x, y, color);
            callback(x, y, currentGrid, bufferGrid);
        }
        this.cellGrid = bufferGrid;
        this.renderGridLines();
    }

    render(timestamp) {
        if (timestamp - this.lastUpdateTime >= this.frameInterval) {
            this.lastUpdateTime = timestamp;
            this.renderFrame({
                callback: this.onRenderFrame
            });
        }
        this.animationId = requestAnimationFrame((ts) => this.render(ts));
    }

    cancelRender() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}