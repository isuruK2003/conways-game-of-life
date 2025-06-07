import { CellGrid } from "./cell-grid.js";

export class CanvasGrid {
    constructor(
        canvasId,
        rows,
        cols,
        cellWidth,
        cellHeight,
        frameIntervalMillis = 100,
        renderFrame = () => { }
    ) {
        this.cellGrid = new CellGrid(rows, cols, cellWidth, cellHeight);
        this.frameInterval = frameIntervalMillis;
        this.renderFrame = renderFrame;
        this.lastUpdateTime = 0;
        this.animationId = null;
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error("canvas element with canvas canvasId=" + canvasId + "can not be found");
        }
        this.canvas.width = this.cellGrid.width;
        this.canvas.height = this.cellGrid.height;
        this.ctx = this.canvas.getContext("2d");

        const handleMouseEvent = (event) => {
            const x = Math.floor((event.x) / this.cellGrid.cellWidth);
            const y = Math.floor((event.y) / this.cellGrid.cellHeight);
            this.cellGrid.setCellState(x, y, 1);
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

    setRenderFrame(renderFrame) {
        this.renderFrame = renderFrame;
    }

    fillCell(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * this.cellGrid.cellWidth,
            y * this.cellGrid.cellHeight,
            this.cellGrid.cellWidth,
            this.cellGrid.cellHeight
        );
    }

    drawGridLines() {
        this.ctx.strokeStyle = "#444";
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x <= this.cellGrid.width; x += this.cellGrid.cellWidth) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.cellGrid.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.cellGrid.height; y += this.cellGrid.cellHeight) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.cellGrid.width, y);
            this.ctx.stroke();
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.cellGrid.width, this.cellGrid.height);
    }

    render(timestamp) {
        if (timestamp - this.lastUpdateTime >= this.frameInterval) {
            this.lastUpdateTime = timestamp;
            this.renderFrame();
        }
        this.animationId = requestAnimationFrame((ts) => this.render(ts));
    }

    cancelRender() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}