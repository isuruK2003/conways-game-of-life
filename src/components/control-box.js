import { Icons } from "../utils/icons.js";

class ControlBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set game(newGame) {
        if (this._game) this._game.cancelRender();

        this._game = newGame;

        const controlBoxButtons = this.shadowRoot.getElementById("control-box-buttons");

        const createButton = (icon, onClick) => {
            const button = document.createElement("button");
            const iconImg = document.createElement("img");
            button.onclick = onClick;
            button.className = "button";
            iconImg.src = icon;
            button.appendChild(iconImg);
            return button;
        };

        const startButton = createButton(Icons.Play, () => {
            newGame.render();
            pauseConfig();
        });

        const pauseButton = createButton(Icons.Pause, () => {
            newGame.cancelRender();
            startConfig();
        });

        const resetButton = createButton(Icons.Reset, () => {
            newGame.reset();
            startConfig();
        });

        const startConfig = () => {
            controlBoxButtons.replaceChildren(startButton, resetButton);
        };

        const pauseConfig = () => {
            controlBoxButtons.replaceChildren(pauseButton, resetButton);
        };

        startConfig();
    }

    connectedCallback() {
        this.renderHtml();
        this.renderStyles();
    }

    renderHtml() {
        const container = document.createElement("div");
        container.innerHTML = `
        <div id="control-box">
            <div id="control-box-buttons">
            </div>
        </div>
        `;
        this.shadowRoot.appendChild(container);
    }

    renderStyles() {
        const styleElement = document.createElement("style");
        styleElement.innerHTML = `
        .button {
            border: none;
            padding: 8px 8px;
            color: #fff;
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 16px;
            background-color: var(--accent-color);
            transition: 0.3s;
        }
    
        .button:hover {
            background-color: var(--accent-color-dark-1);
        }
    
        .button:active {
            background-color: var(--accent-color-dark-2);
        }
    
        .button:disabled {
            opacity: 0.6;
        }
    
        .button img {
            width: 100%;
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
        }
    
        #control-box #control-box-buttons {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            width: 100%;
        }
        `;
        this.shadowRoot.appendChild(styleElement);
    }
}

window.customElements.define('control-box', ControlBox);
