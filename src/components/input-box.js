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
                <div id="box-header">
                    <div id="box-title">
                        ${this.getAttribute('title') || 'Input'}
                    </div>
                </div>
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
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                overflow: hidden;
                animation: fadeIn 0.2s ease-out;
            }

            #input-box {
                width: 380px;
                background-color: #1a1a1a;
                border-radius: 12px;
                border: solid 1px #333;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);

                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
            }

            #button-container {
                display: flex;
                width: 100%;
                height: 40px;
            }

            #button-container button {
                width: 100%;
                height: 100%;
                font: inherit;
                background-color: inherit;
                border: none;
                border-top: solid 1px #333;
                cursor: pointer;
                color: #888;
                font-size: 0.9rem;
            }
                
            #button-container button:nth-child(1) {
                border-bottom-left-radius: 12px;
            }   
                    
            #button-container button:nth-child(2) {
                border-bottom-right-radius: 12px;
                border-left: solid 1px #333;
            }

            #button-container button:hover {
                background-color: #333;
            }

            input {
                background-color: inherit;
                border: none;
                border-bottom: solid 0.5px rgba(226, 135, 9, 0.3);
                font: inherit;
                font-size: 0.95rem;
                width: 90%;
                padding: 8px;
                margin-bottom: 32px;
                color: #aaa;
            }

            input:focus {
                outline: none;
                border-bottom: solid 0.5px rgba(226, 135, 9, 0.6);
            }
                
            #box-header {
                width: 100%;
            }
                
            #box-header #box-title {
                margin: 20px;
                color: #aaa;
                font-size: 1.1rem;
                font-weight: 600;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
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
