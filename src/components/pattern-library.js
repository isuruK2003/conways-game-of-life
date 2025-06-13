import { Icons } from "../utils/icons.js"

class PatternLibraryUtils {
    static async loadSavedPatterns() {
        /*
         * Loads and returns saved patterns from localstorage.
         * Items in the localstorage where the key has prefixed with "pattern-" is considered as a pattern.
        */

        const savedPatterns = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('pattern-')) {
                try {
                    const patternData = JSON.parse(localStorage.getItem(key));
                    const name = key.replace('pattern-', '');
                    savedPatterns.push({
                        name: name,
                        pattern: patternData,
                        key: key
                    });
                } catch (error) {
                    console.warn(`Could not parse pattern ${key}:`, error);
                }
            }
        }

        return savedPatterns;
    }

    static deleteSavedPattern(key) {
        localStorage.removeItem(key);
    }

    static async loadPresets() {
        /**
         * Loads patterns from "assets/patterns/presets.json"
         */
        const presets = [];
        return presets;
    }
}

export class PatternLibrary extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.activeTab = 'presets';
        this.onPatternSelect = null;
        this.onClose = null;
    }

    show() {
        document.body.appendChild(this);
        return this;
    }

    connectedCallback() {
        this.#render();
        this.#setupEventListeners();
        this.switchTab(this.activeTab);
    }

    async switchTab(tabName) {
        this.activeTab = tabName;

        this.shadowRoot.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });

        this.shadowRoot.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        this.shadowRoot.querySelector(`#${tabName}-tab`).classList.add('active');
        this.shadowRoot.querySelector(`#${tabName}-content`).classList.add('active');

        tabName === 'saved' ? await this.#renderSavedPatterns() : this.#renderPresets();
    }

    async #renderPresets() {
        const presetsList = this.shadowRoot.querySelector('#presets-list');
        presetsList.innerHTML = `
            <div class="loading">Loading presets...</div>
        `;
        const presetPatterns = await PatternLibraryUtils.loadPresets();
        if (presetPatterns.length === 0) {
            presetsList.innerHTML = `
                <div class="no-patterns-state">
                    <div class="icon">
                        <img src="${Icons.NoContent}">
                    </div>
                    <div class="title">No presets are available</div>
                </div>
            `;
            return;
        }

        presetsList.innerHTML = '';

        this.presetPatterns.forEach((pattern, index) => {
            const item = this.#createPatternItem(pattern, index, false);
            presetsList.appendChild(item);
        });
    }

    async #renderSavedPatterns() {
        const savedList = this.shadowRoot.querySelector('#saved-list');
        savedList.innerHTML = `
            <div class="loading">Loading presets...</div>
        `;
        const savedPatterns = await PatternLibraryUtils.loadSavedPatterns();
        if (savedPatterns.length === 0) {
            savedList.innerHTML = `
                <div class="no-patterns-state">
                    <div class="icon">
                        <img src="${Icons.NoContent}">
                    </div>
                    <div class="title">No saved patterns</div>
                    <div class="description">Save some patterns from the game to see them here</div>
                </div>
            `;
        } else {
            savedList.innerHTML = '';
            savedPatterns.forEach((pattern, index) => {
                const item = this.#createPatternItem(pattern, index, true);
                savedList.appendChild(item);
            });
        }
    }

    #createPatternItem(pattern, index, isSaved) {
        const item = document.createElement('div');
        item.className = `pattern-item ${isSaved ? 'saved' : ''}`;

        // Add pattern preview
        const preview = this.#createPatternPreview(pattern.pattern);
        item.appendChild(preview);

        const name = document.createElement('div');
        name.className = 'pattern-name';
        name.textContent = pattern.name;

        item.appendChild(name);

        if (isSaved) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-button';
            deleteBtn.innerHTML = '&#10005;';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this pattern?')) {
                    PatternLibraryUtils.deleteSavedPattern(pattern.key)
                    this.#renderSavedPatterns();
                }
            });
            item.appendChild(deleteBtn);
        }

        item.addEventListener('click', () => {
            if (this.onPatternSelect) {
                this.onPatternSelect(pattern);
            }
            this.remove();
        });

        return item;
    }

    #createPatternPreview(pattern) {
        const preview = document.createElement('div');
        preview.className = 'pattern-preview';

        // Create an 8x8 grid for preview
        for (let i = 0; i < 64; i++) {
            const cell = document.createElement('div');
            cell.className = 'pattern-cell';

            const row = Math.floor(i / 8);
            const col = i % 8;

            // Check if this cell should be alive based on the pattern
            if (pattern && pattern[row] && pattern[row][col]) {
                cell.classList.add('alive');
            }

            preview.appendChild(cell);
        }

        return preview;
    }

    #setupEventListeners() {
        // Close button
        this.shadowRoot.querySelector('#close-button').addEventListener('click', () => {
            if (this.onClose) this.onClose();
            this.remove();
        });

        // Tab switching
        this.shadowRoot.querySelector('#presets-tab').addEventListener('click', () => {
            this.switchTab('presets');
        });

        this.shadowRoot.querySelector('#saved-tab').addEventListener('click', () => {
            this.switchTab('saved');
        });

        // Backdrop click
        this.shadowRoot.querySelector('#library-container').addEventListener('click', (e) => {
            if (e.target.id === 'library-container') {
                if (this.onClose) this.onClose();
                this.remove();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.onClose) this.onClose();
                this.remove();
            }
        });
    }

    #render() {
        this.shadowRoot.innerHTML = `
        <div id="library-container">
            <div id="library-modal">
                <div id="library-header">
                    <h2>Library</h2>
                    <button id="close-button">
                        <span>&#10005;</span>
                    </button>
                </div>
                
                <div id="tab-container">
                    <button id="presets-tab" class="tab-button active">Presets</button>
                    <button id="saved-tab" class="tab-button">Saved</button>
                </div>
                
                <div id="content-container">
                    <div id="presets-content" class="tab-content active">
                        <div id="presets-list" class="pattern-list"></div>
                    </div>
                    
                    <div id="saved-content" class="tab-content">
                        <div id="saved-list" class="pattern-list"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            #library-container {
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
                animation: fadeIn 0.2s ease-out;
            }

            #library-modal {
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                animation: slideIn 0.3s ease-out;
            }

            #library-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                background: linear-gradient(135deg, #2a2a2a, #1f1f1f);
                border-bottom: 1px solid #333;
            }

            #library-header h2 {
                margin: 0;
                color: #ccc;
                font-size: 1.1rem;
                font-weight: 600;
            }

            #close-button {
                color: #ccc;
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 8px;
                background: #333;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                line-height: 1;
            }

            #close-button:hover {
                background: #444;
                color: #fff;
            }

            #tab-container {
                display: flex;
                background: #222;
                border-bottom: 1px solid #333;
            }

            .tab-button {
                flex: 1;
                padding: 16px 24px;
                background: none;
                border: none;
                color: #999;
                font-size: 0.95rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            }

            .tab-button:hover {
                background: #2a2a2a;
                color: #ccc;
            }

            .tab-button.active {
                color: rgb(226, 135, 9);
                background: #1a1a1a;
            }

            .tab-button.active::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: rgb(226, 135, 9);
                animation: slideInTab 0.3s ease-out;
            }

            #content-container {
                height: 400px;
                overflow: hidden;
                position: relative;
            }

            .tab-content {
                display: none;
                height: 100%;
                overflow-y: auto;
                padding: 20px;
            }

            .tab-content.active {
                display: block;
                animation: fadeInContent 0.3s ease-out;
            }

            .pattern-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 16px;
                padding: 4px;
            }

            .pattern-item {
                background: #2a2a2a;
                border: 1px solid #333;
                border-radius: 8px;
                padding: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            }

            .pattern-item:hover {
                background: #333;
                border-color: rgb(226, 135, 9);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(226, 135, 9, 0.2);
            }

            .pattern-item.saved {
                border-color: #555;
            }

            .pattern-item.saved:hover {
                border-color: #2196F3;
                box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
            }

            .pattern-preview {
                display: grid;
                grid-template-columns: repeat(8, 1fr);
                gap: 1px;
                aspect-ratio: 1;
                margin-bottom: 8px;
                background: #1a1a1a;
                border-radius: 4px;
                padding: 4px;
            }

            .pattern-cell {
                background: #333;
                border-radius: 1px;
                transition: background-color 0.1s ease;
            }

            .pattern-cell.alive {
                background: rgb(226, 135, 9);
                box-shadow: 0 0 3px rgba(226, 135, 9, 0.5);
            }

            .pattern-item.saved .pattern-cell.alive {
                background: #2196F3;
                box-shadow: 0 0 3px rgba(33, 150, 243, 0.5);
            }

            .pattern-name {
                color: #ccc;
                font-size: 0.85rem;
                font-weight: 500;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .delete-button {
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(244, 67, 54, 0.8);
                border: none;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 0.7rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: all 0.2s ease;
                transform: scale(0.8);
            }

            .pattern-item:hover .delete-button {
                opacity: 1;
                transform: scale(1);
            }

            .delete-button:hover {
                background: #f44336;
                transform: scale(1.1);
            }

            /* State messages */
            .loading,
            .error-state,
            .no-patterns-state {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 200px;
                color: #999;
                text-align: center;
                grid-column: 1 / -1;
            }

            .loading {
                animation: pulse 1.5s ease-in-out infinite;
            }

            .error-state .icon, .no-patterns-state .icon {
                font-size: 2.5rem;
                margin-bottom: 12px;
                opacity: 0.7;
            }
            
            .icon img {
                width: 75px;
                opacity: 0.75;
            }

            .error-state .title,
            .no-patterns-state .title {
                color: #ccc;
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 8px;
            }

            .error-state .description,
            .no-patterns-state .description {
                font-size: 0.9rem;
                line-height: 1.4;
                max-width: 300px;
            }

            .error-state {
                color: #ff6b6b;
            }

            .error-state .icon {
                filter: sepia(1) hue-rotate(320deg) saturate(2);
            }

            /* Scrollbar styling */
            .tab-content::-webkit-scrollbar {
                width: 8px;
            }

            .tab-content::-webkit-scrollbar-track {
                background: #1a1a1a;
            }

            .tab-content::-webkit-scrollbar-thumb {
                background: #444;
                border-radius: 4px;
            }

            .tab-content::-webkit-scrollbar-thumb:hover {
                background: #555;
            }

            /* Animations */
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

            @keyframes slideInTab {
                from {
                    transform: scaleX(0);
                }
                to {
                    transform: scaleX(1);
                }
            }

            @keyframes fadeInContent {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes pulse {
                0%, 100% {
                    opacity: 0.6;
                }
                50% {
                    opacity: 1;
                }
            }

            /* Responsive design */
            @media (max-width: 768px) {
                #library-modal {
                    width: 95%;
                    max-height: 85vh;
                }
                
                #library-header {
                    padding: 16px 20px;
                }
                
                #library-header h2 {
                    font-size: 1.2rem;
                }
                
                .tab-button {
                    padding: 12px 16px;
                    font-size: 0.9rem;
                }
                
                .tab-content {
                    padding: 16px;
                }
                
                .pattern-list {
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 12px;
                }
                
                .pattern-item {
                    padding: 10px;
                }
                
                .pattern-name {
                    font-size: 0.8rem;
                }
            }

            @media (max-width: 480px) {
                .pattern-list {
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 10px;
                }
                
                .pattern-item {
                    padding: 8px;
                }
                
                .pattern-preview {
                    padding: 3px;
                }
            }
        </style>
        `;
    }
}

window.customElements.define('pattern-library', PatternLibrary);