import { GameOfLife } from "./lib/gof.js";
import { Grid } from "./lib/grid.js";

class Icons {
    static Play = "../assets/icons/play_arrow_24dp.svg";
    static Pause = "../assets/icons/pause_24dp.svg";
    static Reset = "../assets/icons/reset_24dp.svg";
}

function main() {

    const cellSize = 10;
    const cols = Math.floor((window.innerWidth - 1) / cellSize);
    const rows = Math.floor((window.innerHeight - 1) / cellSize);
    const grid = new Grid(rows, cols, cellSize, cellSize);
    const game = new GameOfLife("canvas", grid);

    const controlBoxButtons = document.getElementById("control-box-buttons");

    const createButton = (icon, onClick) => {
        const button = document.createElement("button");
        const iconImg = document.createElement("img");
        button.onclick = onClick;
        button.className = "button";
        iconImg.src = icon;
        button.appendChild(iconImg);
        return button;
        ;
    };

    const startButton = createButton(
        Icons.Play,
        () => {
            game.render();
            pauseConfig();
        }
    );

    const pauseButton = createButton(
        Icons.Pause,
        () => {
            game.cancelRender();
            startConfig();
        }
    );

    const resetButton = createButton(
        Icons.Reset,
        () => {
            game.reset();
            startConfig();
        }
    );

    const startConfig = () => {
        controlBoxButtons.replaceChildren(startButton, resetButton);
    };

    const pauseConfig = () => {
        controlBoxButtons.replaceChildren(pauseButton, resetButton);
    };

    startConfig();
}

window.addEventListener("DOMContentLoaded", main)