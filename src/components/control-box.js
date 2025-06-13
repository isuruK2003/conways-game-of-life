import { Icons } from "../utils/icons.js";
import { InputBox } from "./input-box.js";
import { PatternLibrary } from "./pattern-library.js";

class ControlBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set game(newGame) {
        if (this._game) this._game.reset();

        this.shadowRoot.querySelector("#play-pause-button").addEventListener('click', () => { newGame.togglePlaying() });
        this.shadowRoot.querySelector("#grid-toggle-button").addEventListener('click', () => { newGame.toggleGridLines() });
        this.shadowRoot.querySelector("#reset-button").addEventListener('click', () => { newGame.reset() });

        newGame.addEventListener("togglePlaying", () => {
            const img = this.shadowRoot.querySelector("#play-pause-button-img");
            img.src = newGame.isPlaying ? Icons.Pause : Icons.Play;
        });

        newGame.addEventListener("toggleGrid", () => {
            const img = this.shadowRoot.querySelector("#grid-toggle-button-img");
            img.src = newGame.gridRenderer.gridLinesEnabled ? Icons.GridOn : Icons.GridOff;
        });

        newGame.addEventListener("reset", () => {
            const img = this.shadowRoot.querySelector("#play-pause-button-img");
            img.src = newGame.isPlaying ? Icons.Pause : Icons.Play;
        });

        this.shadowRoot.querySelector("#save-button").addEventListener('click', (e) => {
            const hasPlaying = newGame.isPlaying;
            hasPlaying && newGame.togglePlaying()
            const grid = JSON.stringify(newGame.gridRenderer.cellGrid.cells);
            const inputBox = new InputBox({
                title: 'Save Pattern',
                placeholder: 'Enter pattern name...',
                onOk: (name) => {
                    if (name) {
                        localStorage.setItem(`pattern-${name}`, grid);
                        hasPlaying && newGame.togglePlaying();
                    }
                },
                onLeaving: () => {
                    hasPlaying && newGame.togglePlaying();
                },
            });
            inputBox.show();
        });

        this.shadowRoot.querySelector("#open-library-button").addEventListener('click', (e) => {
            const library = new PatternLibrary();
            library.show();
        });

        this._game = newGame;
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
        <div id="control-box">
            <button id="play-pause-button">
                <img id="play-pause-button-img" src="${Icons.Play}">
            </button>
            <button id="reset-button">
                <img src="${Icons.Reset}">
            </button>
            <button id="grid-toggle-button">
                <img id="grid-toggle-button-img" src="${Icons.GridOn}">
            </button>
            <button id="save-button">
                <img id="save-button-img" src="${Icons.Save}">
            </button>
            <button id="open-library-button">
                <img id="open-library-button-img" src="${Icons.OpenLibrary}">
            </button>
        </div>

        <style>
        button {
            border: none;
            padding: 8px 8px;
            color: #fff;
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 16px;
            background-color: rgb(226, 135, 9);
            transition: 0.3s;
            outline: none;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        button:hover:not(:disabled) {
            background-color: rgb(196, 115, 3);
        }

        button:active:not(:disabled) {
            background-color: rgb(183, 108, 3);
        }

        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        button:focus {
            box-shadow: 0 0 0 3px rgba(226, 136, 9, 0.3);
        }

        button img {
            width: 100%;
            height: auto;
            display: block;
        }

        #control-box {
            position: absolute;
            bottom: 0;
            right: 0;
            z-index: 1;
            background: rgba(0, 0, 0, 0.3);
            padding: 16px;
            border-radius: 32px;
            margin: 16px;
            border: 1px solid #333;

            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        </style>
        `;
    }
}

window.customElements.define('control-box', ControlBox);
