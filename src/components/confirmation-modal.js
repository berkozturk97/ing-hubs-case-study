import {LitElement, html, css} from 'lit';
import './modal.js';
import './custom-button.js';

export class ConfirmationModal extends LitElement {
  static get properties() {
    return {
      open: {type: Boolean},
      title: {type: String},
      message: {type: String},
      warningText: {type: String},
      confirmButtonText: {type: String},
      cancelButtonText: {type: String},
      confirmButtonVariant: {type: String}, // 'primary', 'danger'
      loading: {type: Boolean},
      data: {type: Object},
    };
  }

  constructor() {
    super();
    this.open = false;
    this.title = '';
    this.message = '';
    this.warningText = '';
    this.confirmButtonText = 'Confirm';
    this.cancelButtonText = 'Cancel';
    this.confirmButtonVariant = 'primary';
    this.loading = false;
    this.data = null;
  }

  static get styles() {
    return css`
      :host {
        display: contents;
      }

      .confirmation-content {
        text-align: center;
        padding: 8px 0;
      }

      .icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      .icon.warning {
        color: #d32f2f;
      }

      .icon.question {
        color: #ff6200;
      }

      .icon.info {
        color: #1976d2;
      }

      .confirmation-message {
        font-size: 16px;
        color: #333;
        margin-bottom: 8px;
        line-height: 1.5;
      }

      .data-info {
        background-color: #f5f5f5;
        padding: 16px;
        border-radius: 8px;
        margin: 16px 0;
        border-left: 4px solid var(--border-color, #ff6200);
      }

      .data-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }

      .data-details {
        font-size: 14px;
        color: #666;
        line-height: 1.4;
      }

      .warning-text {
        font-size: 14px;
        color: #d32f2f;
        font-style: italic;
        margin-top: 16px;
      }

      .button-group {
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      @media (max-width: 768px) {
        .button-group {
          flex-direction: column-reverse;
          gap: 8px;
        }

        .confirmation-message {
          font-size: 15px;
        }

        .data-title {
          font-size: 16px;
        }
      }
    `;
  }

  openModal() {
    this.open = true;
    const modal = this.shadowRoot.querySelector('app-modal');
    if (modal) {
      modal.openModal();
    }
  }

  closeModal() {
    this.open = false;
    const modal = this.shadowRoot.querySelector('app-modal');
    if (modal) {
      modal.closeModal();
    }
  }

  _handleCancel() {
    this.closeModal();
    this.dispatchEvent(
      new CustomEvent('confirmation-cancelled', {
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleConfirm() {
    this.dispatchEvent(
      new CustomEvent('confirmation-confirmed', {
        detail: {data: this.data},
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleModalClosed() {
    this.open = false;
  }

  _getIcon() {
    if (this.confirmButtonVariant === 'danger') {
      return '⚠️';
    } else if (this.confirmButtonVariant === 'primary') {
      return '❓';
    } else {
      return 'ℹ️';
    }
  }

  _getIconClass() {
    if (this.confirmButtonVariant === 'danger') {
      return 'warning';
    } else if (this.confirmButtonVariant === 'primary') {
      return 'question';
    } else {
      return 'info';
    }
  }

  render() {
    return html`
      <app-modal
        ?open="${this.open}"
        title="${this.title}"
        size="small"
        ?loading="${this.loading}"
        .closeOnBackdrop="${!this.loading}"
        @modal-closed="${this._handleModalClosed}"
      >
        <div slot="content" class="confirmation-content">
          <div class="icon ${this._getIconClass()}">${this._getIcon()}</div>

          <div class="confirmation-message">${this.message}</div>

          ${this.data
            ? html`
                <div
                  class="data-info"
                  style="--border-color: ${this.confirmButtonVariant ===
                  'danger'
                    ? '#d32f2f'
                    : '#ff6200'}"
                >
                  <slot name="data-content">
                    <div class="data-title">
                      ${this.data.title || 'Information'}
                    </div>
                    <div class="data-details">${this.data.details || ''}</div>
                  </slot>
                </div>
              `
            : ''}
          ${this.warningText
            ? html` <div class="warning-text">${this.warningText}</div> `
            : ''}
        </div>

        <div slot="footer" class="button-group">
          <custom-button
            variant="secondary"
            @button-click="${this._handleCancel}"
            ?disabled="${this.loading}"
          >
            ${this.cancelButtonText}
          </custom-button>

          <custom-button
            variant="${this.confirmButtonVariant}"
            ?loading="${this.loading}"
            @button-click="${this._handleConfirm}"
          >
            ${this.confirmButtonText}
          </custom-button>
        </div>
      </app-modal>
    `;
  }
}

customElements.define('confirmation-modal', ConfirmationModal);
