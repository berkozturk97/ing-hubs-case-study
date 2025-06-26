import {LitElement, html, css} from 'lit';
import './custom-button.js';
import './loading-spinner.js';

export class Modal extends LitElement {
  static get properties() {
    return {
      open: {type: Boolean},
      title: {type: String},
      size: {type: String}, // 'small', 'medium', 'large'
      loading: {type: Boolean},
      showCloseButton: {type: Boolean},
      closeOnBackdrop: {type: Boolean},
      showFooter: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.open = false;
    this.title = '';
    this.size = 'medium';
    this.loading = false;
    this.showCloseButton = true;
    this.closeOnBackdrop = true;
    this.showFooter = true;
  }

  static get styles() {
    return css`
      :host {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        width: 100vw;
        height: 100vh;
      }

      :host([open]) {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
      }

      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .modal-container {
        position: relative;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-height: 90vh;
        overflow: hidden;
        cursor: default;
        animation: modalEnter 0.3s ease-out;
        display: flex;
        flex-direction: column;
        z-index: 1;
      }

      @keyframes modalEnter {
        from {
          opacity: 0;
          transform: scale(0.9) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      .modal-container.small {
        width: 400px;
        max-width: 400px;
      }

      .modal-container.medium {
        width: 500px;
        max-width: 500px;
      }

      .modal-container.large {
        width: 700px;
        max-width: 700px;
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px 24px 16px 24px;
        border-bottom: 1px solid #f0f0f0;
        flex-shrink: 0;
      }

      .modal-title {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }

      .close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        background: none;
        color: #666;
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.2s ease;
        font-size: 18px;
      }

      .close-button:hover {
        background-color: #f5f5f5;
        color: #333;
      }

      .modal-content {
        padding: 24px;
        flex: 1;
        overflow-y: auto;
        min-height: 0;
      }

      .modal-footer {
        padding: 16px 24px 24px 24px;
        border-top: 1px solid #f0f0f0;
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-shrink: 0;
      }

      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
      }

      @media (max-width: 768px) {
        :host([open]) {
          padding: 16px;
        }

        .modal-container {
          width: calc(100vw - 32px);
          max-width: calc(100vw - 32px);
          max-height: calc(100vh - 32px);
        }

        .modal-header {
          padding: 20px 20px 12px 20px;
        }

        .modal-content {
          padding: 20px;
        }

        .modal-footer {
          padding: 12px 20px 20px 20px;
          flex-direction: column-reverse;
          justify-content: center;
        }

        .modal-title {
          font-size: 18px;
        }
      }

      @media (max-width: 480px) {
        :host([open]) {
          padding: 8px;
        }

        .modal-container {
          width: calc(100vw - 16px);
          max-width: calc(100vw - 16px);
          max-height: calc(100vh - 16px);
        }
      }
    `;
  }

  openModal() {
    this.open = true;
    document.body.style.overflow = 'hidden';
    this.dispatchEvent(
      new CustomEvent('modal-opened', {
        bubbles: true,
        composed: true,
      })
    );
  }

  closeModal() {
    this.open = false;
    document.body.style.overflow = '';
    this.dispatchEvent(
      new CustomEvent('modal-closed', {
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleBackdropClick(event) {
    if (this.closeOnBackdrop && event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  _handleCloseClick() {
    this.closeModal();
  }

  _handleKeydown(event) {
    if (event.key === 'Escape' && this.open) {
      this.closeModal();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._handleKeydown.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._handleKeydown.bind(this));
    document.body.style.overflow = '';
  }

  render() {
    return html`
      <div class="modal-backdrop" @click="${this._handleBackdropClick}">
        <div
          class="modal-container ${this.size}"
          @click="${(e) => e.stopPropagation()}"
        >
          ${this.loading
            ? html`
                <div class="loading-overlay">
                  <loading-spinner size="large"></loading-spinner>
                </div>
              `
            : ''}
          ${this.title || this.showCloseButton
            ? html`
                <div class="modal-header">
                  <h2 class="modal-title">${this.title}</h2>
                  ${this.showCloseButton
                    ? html`
                        <button
                          class="close-button"
                          @click="${this._handleCloseClick}"
                          ?disabled="${this.loading}"
                        >
                          ✕
                        </button>
                      `
                    : ''}
                </div>
              `
            : ''}

          <div class="modal-content">
            <slot name="content"></slot>
          </div>

          ${this.showFooter
            ? html`
                <div class="modal-footer">
                  <slot name="footer"></slot>
                </div>
              `
            : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('app-modal', Modal);
