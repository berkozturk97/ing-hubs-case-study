import {LitElement, html, css} from 'lit';
import {ReduxLocalizedMixin} from '../localization/redux-localized-mixin.js';

export class SearchBar extends ReduxLocalizedMixin(LitElement) {
  static get properties() {
    return {
      searchTerm: {type: String},
      placeholder: {type: String},
      disabled: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.searchTerm = '';
    this.placeholder = '';
    this.disabled = false;
  }

  stateChanged(state) {
    super.stateChanged(state);
    this.searchTerm = state.ui.filters.search || '';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
      }

      .search-container {
        position: relative;
        display: flex;
        align-items: center;
        background: white;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        padding: 12px 16px;
        transition: all 0.2s ease;
        max-width: 100%;
      }

      .search-container:focus-within {
        border-color: #ff6200;
        box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
      }

      .search-container:hover {
        border-color: #ccc;
      }

      .search-icon {
        font-size: 18px;
        color: #999;
        margin-right: 12px;
        flex-shrink: 0;
      }

      .search-input {
        border: none;
        outline: none;
        background: transparent;
        font-size: 16px;
        color: #333;
        width: 100%;
        font-family: inherit;
      }

      .search-input::placeholder {
        color: #999;
        font-size: 14px;
      }

      .clear-button {
        background: none;
        border: none;
        font-size: 18px;
        color: #999;
        cursor: pointer;
        padding: 4px;
        margin-left: 8px;
        border-radius: 4px;
        transition: all 0.2s ease;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
      }

      .clear-button:hover {
        background-color: #f5f5f5;
        color: #666;
      }

      .clear-button:focus {
        outline: 2px solid #ff6200;
        outline-offset: 2px;
      }

      .search-container.disabled {
        opacity: 0.6;
        pointer-events: none;
      }

      @media (max-width: 768px) {
        .search-container {
          padding: 10px 14px;
        }

        .search-input {
          font-size: 14px;
        }

        .search-input::placeholder {
          font-size: 13px;
        }

        .search-icon {
          font-size: 16px;
          margin-right: 10px;
        }

        .clear-button {
          width: 20px;
          height: 20px;
          font-size: 16px;
        }
      }

      @media (max-width: 480px) {
        .search-container {
          padding: 8px 12px;
        }

        .search-input {
          font-size: 14px;
        }

        .search-icon {
          margin-right: 8px;
        }
      }
    `;
  }

  _handleInput(event) {
    const value = event.target.value;
    this.searchTerm = value;

    // Debounce search to avoid too many dispatches
    clearTimeout(this._searchTimeout);
    this._searchTimeout = setTimeout(() => {
      this._dispatchSearch(value);
    }, 300);
  }

  _handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      clearTimeout(this._searchTimeout);
      this._dispatchSearch(this.searchTerm);
    } else if (event.key === 'Escape') {
      this._clearSearch();
    }
  }

  _clearSearch() {
    this.searchTerm = '';
    const input = this.shadowRoot.querySelector('.search-input');
    if (input) {
      input.value = '';
      input.focus();
    }
    this._dispatchSearch('');
  }

  _dispatchSearch(searchTerm) {
    this.dispatchEvent(
      new CustomEvent('search', {
        detail: {searchTerm},
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const effectivePlaceholder =
      this.placeholder || this.t('employees.searchPlaceholder');

    return html`
      <div class="search-container ${this.disabled ? 'disabled' : ''}">
        <span class="search-icon">🔍</span>
        <input
          class="search-input"
          type="text"
          .value="${this.searchTerm}"
          placeholder="${effectivePlaceholder}"
          ?disabled="${this.disabled}"
          @input="${this._handleInput}"
          @keydown="${this._handleKeyDown}"
          aria-label="${this.t('common.search')}"
        />
        ${this.searchTerm
          ? html`
              <button
                class="clear-button"
                @click="${this._clearSearch}"
                title="${this.t('common.clear')}"
                aria-label="${this.t('common.clear')}"
              >
                ✕
              </button>
            `
          : ''}
      </div>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._searchTimeout) {
      clearTimeout(this._searchTimeout);
    }
  }
}

customElements.define('search-bar', SearchBar);
