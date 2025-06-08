class ToggleButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._active = false;
    }

    static get observedAttributes() {
        return ['active', 'disabled', 'default-icon', 'active-icon'];
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.addEventListener('click', this.handleClick.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'active') {
            this._active = newValue !== null;
            this.updateState();
        }
        if (name === 'disabled') {
            this.updateState();
        }
        if (name === 'default-icon' || name === 'active-icon') {
            this.updateIcon();
        }
    }

    get active() {
        return this._active;
    }

    set active(value) {
        if (value) {
            this.setAttribute('active', '');
        } else {
            this.removeAttribute('active');
        }
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(value) {
        if (value) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    get defaultIcon() {
        return this.getAttribute('default-icon');
    }

    set defaultIcon(value) {
        if (value) {
            this.setAttribute('default-icon', value);
        } else {
            this.removeAttribute('default-icon');
        }
    }

    get activeIcon() {
        return this.getAttribute('active-icon');
    }

    set activeIcon(value) {
        if (value) {
            this.setAttribute('active-icon', value);
        } else {
            this.removeAttribute('active-icon');
        }
    }

    handleClick(e) {
        if (this.disabled) return;

        this.active = !this.active;

        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('toggle', {
            detail: { active: this.active },
            bubbles: true
        }));
    }

    updateState() {
        const button = this.shadowRoot.querySelector('button');
        if (button) {
            button.classList.toggle('active', this._active);
            button.disabled = this.disabled;
            button.setAttribute('aria-pressed', this._active);
        }
        this.updateIcon();
    }

    updateIcon() {
        const img = this.shadowRoot.querySelector('img');
        if (img) {
            const currentIcon = this._active ? this.activeIcon : this.defaultIcon;
            if (currentIcon) {
                img.src = currentIcon;
                img.style.display = 'block';
            } else {
                img.style.display = 'none';
            }
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .button {
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

                .button:hover:not(:disabled) {
                    background-color: rgb(196, 115, 3);
                }

                .button:active:not(:disabled) {
                    background-color: rgb(183, 108, 3);
                }

                .button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .button:focus {
                    box-shadow: 0 0 0 3px rgba(226, 136, 9, 0.3);
                }

                .button img {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                .button:has(img[style*="display: block"]) slot {
                    display: none;
                }
            </style>
            <button class="button" role="switch" aria-pressed="${this._active}">
                <img alt="toggle button icon" style="display: none;">
                <slot></slot>
            </button>
        `;

        this.updateState();
    }
}

window.customElements.define('toggle-button', ToggleButton);