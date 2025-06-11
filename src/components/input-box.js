export class InputBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.onOk = null;
        this.onCancel = null;
    }

    static get observedAttributes() {
        return ['title', 'placeholder', 'value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            this.updateContent();
        }
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
        <div id="input-box-container">
            <div id="input-box">
                <h2 id="box-title">${this.getAttribute('title') || 'Input'}</h2>
                <input 
                    type="text" 
                    id="box-input" 
                    placeholder="${this.getAttribute('placeholder') || 'Enter value...'}"
                    value="${this.getAttribute('value') || ''}"
                >
                <div id="button-container">
                    <button id="cancel-button">Cancel</button>
                    <button id="ok-button">OK</button>
                </div>
            </div>
        </div>
        <style>
            #input-box-container {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 1000;
                height: 100vh;
                width: 100vw;
                background: rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(4px);
            }
                
            #input-box {
                position: relative;                
                background: #1a1a1a;
                border-radius: 12px;
                border: 1px solid #333;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                margin: 16px;
                padding: 24px;
                min-width: 300px;
                max-width: 400px;
                width: 90%;
            }
            
            #box-title {
                font-size: 20px;
                margin: 0 0 20px 0;
                color: #fff;
                text-align: center;
                font-weight: bold;
            }
        
            #box-input {
                width: 100%;
                box-sizing: border-box;
                padding: 12px 16px;
                font-size: 16px;
                border: 1px solid #333;
                border-radius: 8px;
                color: #fff;
                background: inherit;
                margin-bottom: 24px;
                outline: none;
                transition: border-color 0.3s ease;
            }

            #box-input::placeholder {
                color: #666;
            }

            #box-input:focus {
                border-color: rgba(196, 116, 3, 0.5);
            }

            #button-container {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }

            button {
                border: none;
                padding: 10px 20px;
                color: #fff;
                cursor: pointer;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                outline: none;
                min-width: 70px;
            }

            #cancel-button {
                background-color: #444;
            }

            #cancel-button:hover {
                background-color: #555;
            }

            #cancel-button:active {
                background-color: #333;
            }

            #ok-button {
                background-color: rgb(226, 135, 9);
            }

            #ok-button:hover {
                background-color: rgb(196, 115, 3);
            }

            #ok-button:active {
                background-color: rgb(183, 108, 3);
            }

            button:focus {
                box-shadow: 0 0 0 2px rgba(226, 136, 9, 0.3);
            }

            @media (max-width: 480px) {
                #input-box {
                    padding: 20px;
                    min-width: 280px;
                }

                #box-title {
                    font-size: 18px;
                }

                #button-container {
                    flex-direction: column-reverse;
                }

                button {
                    width: 100%;
                }
            }
        </style>
        `;

        this.setupEventListeners();

        // Focus the input when box opens
        setTimeout(() => {
            this.shadowRoot.querySelector('#box-input').focus();
        }, 100);
    }

    setupEventListeners() {
        const input = this.shadowRoot.querySelector('#box-input');
        const okButton = this.shadowRoot.querySelector('#ok-button');
        const cancelButton = this.shadowRoot.querySelector('#cancel-button');

        okButton.addEventListener('click', () => {
            const value = input.value.trim();
            if (this.onOk) {
                this.onOk(value);
            }
            this.remove();
        });

        cancelButton.addEventListener('click', () => {
            if (this.onCancel) {
                this.onCancel();
            }
            this.remove();
        });

        // Handle Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                okButton.click();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelButton.click();
            }
        });

        // Handle backdrop click
        this.shadowRoot.querySelector('#input-box-container').addEventListener('click', (e) => {
            if (e.target.id === 'input-box-container') {
                cancelButton.click();
            }
        });
    }

    updateContent() {
        if (!this.shadowRoot) return;

        const title = this.shadowRoot.querySelector('#box-title');
        const input = this.shadowRoot.querySelector('#box-input');

        if (title) title.textContent = this.getAttribute('title') || 'Input';
        if (input) {
            input.placeholder = this.getAttribute('placeholder') || 'Enter value...';
            input.value = this.getAttribute('value') || '';
        }
    }

    // Public methods for easier usage
    show(title, placeholder = '', defaultValue = '') {
        if (title) this.setAttribute('title', title);
        if (placeholder) this.setAttribute('placeholder', placeholder);
        if (defaultValue) this.setAttribute('value', defaultValue);

        document.body.appendChild(this);
        return this;
    }

    getValue() {
        return this.shadowRoot?.querySelector('#box-input')?.value || '';
    }
}

window.customElements.define('input-box', InputBox);
