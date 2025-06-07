class WelcomeScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.renderHtml();
        this.renderStyles();
    }

    renderHtml() {
        this.shadowRoot.innerHTML = `
        <div id="welcome-screen-container">
            <div id="welcome-screen">
                <button id="close-button">&#10005;</button>
                <h1>Conway's Game of Life</h1>
                <p>
                    Conway's Game of Life is a zero-player game that simulates cellular evolution.
                    Each cell on the grid lives, dies, or is born based on a few simple rules:
                </p>
                <ul>
                    <li>A live cell with 2 or 3 neighbors survives.</li>
                    <li>A dead cell with exactly 3 neighbors becomes alive.</li>
                    <li>All other cells die or remain dead.</li>
                </ul>
                <p>
                    To play the game create your own pattern on the grid and click on the play button.
                </p>
                <p>
                    View source on
                    <a href="https://github.com/isuruK2003/conways-game-of-life" target="_blank"
                        rel="noopener noreferrer">GitHub</a>
                </p>
            </div>
        </div>
        `;
        this.shadowRoot.querySelector('#close-button').addEventListener('click', () => this.remove());
    }

    renderStyles() {
        const styleElement = document.createElement("style")
        styleElement.innerHTML = `
            #welcome-screen-container {
                position: absolute;
                z-index: 2;
                height: 100vh;
                width: 100vw;
                background: rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(4px);
            }

            #welcome-screen {
                position: relative;
                width: 520px;
                max-width: 90vw;
                background: #1a1a1a;
                border-radius: 12px;
                padding: 40px;
                border: 1px solid #333;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }
            
            #welcome-screen h1 {
                font-size: 28px;
                margin-bottom: 24px;
                color: #fff;
                text-align: center;
                font-weight: bold;
            }

            #welcome-screen p {
                font-size: 16px;
                margin-bottom: 20px;
                color: #ccc;
                line-height: 1.6;
                text-align: center;
            }

            #welcome-screen ul {
                list-style: none;
                padding: 0;
                margin: 24px 0;
                background: #222;
                border-radius: 8px;
                padding: 20px;
            }

            #welcome-screen ul li {
                margin-bottom: 12px;
                color: #ccc;
                position: relative;
                padding-left: 24px;
                font-size: 15px;
                line-height: 1.5;
            }

            #welcome-screen ul li::before {
                content: '●';
                position: absolute;
                left: 0;
                color: var(--accent-color);
                font-size: 18px;
                top: -2px;
            }

            #welcome-screen ul li:last-child {
                margin-bottom: 0;
            }

            #welcome-screen a {
                color: var(--accent-color);
                text-decoration: none;
                transition: color 0.3s ease;
            }

            #welcome-screen a:hover {
                color: var(--accent-color-light-1);
            }

            #welcome-screen #close-button {
                position: absolute;
                top: 16px;
                right: 16px;
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 8px;
                background: #333;
                color: #ccc;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                line-height: 1;
            }

            #welcome-screen #close-button:hover {
                background: #444;
                color: #fff;
            }

            @media (max-width: 600px) {
                #welcome-screen {
                    margin: 20px;
                    padding: 30px 25px;
                }

                #welcome-screen h1 {
                    font-size: 26px;
                }

                #welcome-screen p {
                    font-size: 15px;
                }
            }
        `;
        this.shadowRoot.appendChild(styleElement);
    }
}

window.customElements.define('welcome-screen', WelcomeScreen);