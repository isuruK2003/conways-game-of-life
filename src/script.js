import { GameOfLife } from "./core/game.js";
import { Grid } from "./core/grid.js";

function main() {
    const cellSize = 10;
    const cols = Math.floor((window.innerWidth - 1) / cellSize);
    const rows = Math.floor((window.innerHeight - 1) / cellSize);
    const grid = new Grid(rows, cols, cellSize, cellSize);
    const game = new GameOfLife("canvas", grid);

    document.querySelector("control-box").game = game;
}

window.addEventListener("DOMContentLoaded", main)