import {LitElement, html, css} from 'lit';
import {t} from '../localization/index.js';
import './modal.js';
import './custom-button.js';

export class DeleteConfirmationModal extends LitElement {
  static get properties() {
    return {
      open: {type: Boolean},
      employee: {type: Object},
      loading: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.open = false;
    this.employee = null;
    this.loading = false;
  }

  static get styles() {
    return css`
      :host {
        display: contents;
      }

      .delete-content {
        text-align: center;
        padding: 8px 0;
      }

      .warning-icon {
        font-size: 48px;
        color: #d32f2f;
        margin-bottom: 16px;
      }

      .delete-message {
        font-size: 16px;
        color: #333;
        margin-bottom: 8px;
        line-height: 1.5;
      }

      .employee-info {
        background-color: #f5f5f5;
        padding: 16px;
        border-radius: 8px;
        margin: 16px 0;
        border-left: 4px solid #d32f2f;
      }

      .employee-name {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }

      .employee-details {
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

      /* Mobile responsive */
      @media (max-width: 768px) {
        .button-group {
          flex-direction: column-reverse;
          gap: 8px;
        }

        .delete-message {
          font-size: 15px;
        }

        .employee-name {
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
      new CustomEvent('delete-cancelled', {
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleConfirm() {
    this.dispatchEvent(
      new CustomEvent('delete-confirmed', {
        detail: {employee: this.employee},
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleModalClosed() {
    this.open = false;
  }

  render() {
    if (!this.employee) {
      return html``;
    }

    return html`
      <app-modal
        ?open="${this.open}"
        title="${t('deleteModal.title')}"
        size="small"
        ?loading="${this.loading}"
        .closeOnBackdrop="${!this.loading}"
        @modal-closed="${this._handleModalClosed}"
      >
        <div slot="content" class="delete-content">
          <div class="warning-icon">⚠️</div>

          <div class="delete-message">${t('deleteModal.message')}</div>

          <div class="employee-info">
            <div class="employee-name">
              ${this.employee.firstName} ${this.employee.lastName}
            </div>
            <div class="employee-details">
              ${this.employee.email}<br />
              ${this.employee.department} - ${this.employee.position}
            </div>
          </div>

          <div class="warning-text">${t('deleteModal.warning')}</div>
        </div>

        <div slot="footer" class="button-group">
          <custom-button
            variant="secondary"
            @button-click="${this._handleCancel}"
            ?disabled="${this.loading}"
          >
            ${t('deleteModal.cancelButton')}
          </custom-button>

          <custom-button
            variant="danger"
            ?loading="${this.loading}"
            @button-click="${this._handleConfirm}"
          >
            ${t('deleteModal.confirmButton')}
          </custom-button>
        </div>
      </app-modal>
    `;
  }
}

customElements.define('delete-confirmation-modal', DeleteConfirmationModal);
