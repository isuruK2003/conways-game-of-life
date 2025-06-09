import { CanvasGridRenderer } from "./core/canvas-grid.js";
import { GameOfLife } from "./core/game.js";

function main() {
    const cellSize = 10;
    const cols = Math.floor((window.innerWidth - 1) / cellSize);
    const rows = Math.floor((window.innerHeight - 1) / cellSize);
    const grid = new CanvasGridRenderer("canvas", rows, cols, cellSize, cellSize);
    const game = new GameOfLife(grid);

    document.querySelector("control-box").game = game;
}

window.addEventListener("DOMContentLoaded", main)