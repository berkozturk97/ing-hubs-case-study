import {LitElement, html, css} from 'lit';
import './toast.js';

export class ToastManager extends LitElement {
  static get properties() {
    return {
      toasts: {type: Array},
    };
  }

  constructor() {
    super();
    this.toasts = [];
    this._toastCounter = 0;
  }

  static get styles() {
    return css`
      :host {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      app-toast {
        pointer-events: auto;
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        :host {
          top: 10px;
          right: 10px;
          left: 10px;
          gap: 8px;
        }
      }
    `;
  }

  addToast(message, type = 'info', duration = 4000, description = '') {
    const id = `toast-${++this._toastCounter}-${Date.now()}`;
    const toast = {
      id,
      message,
      type,
      duration,
      description,
    };

    this.toasts = [...this.toasts, toast];
    this.requestUpdate();

    return id;
  }

  removeToast(id) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.requestUpdate();
  }

  _handleToastClose(event) {
    const {id} = event.detail;
    this.removeToast(id);
  }

  success(message, duration = 4000, description = '') {
    return this.addToast(message, 'success', duration, description);
  }

  error(message, duration = 6000, description = '') {
    return this.addToast(message, 'error', duration, description);
  }

  warning(message, duration = 5000, description = '') {
    return this.addToast(message, 'warning', duration, description);
  }

  info(message, duration = 4000, description = '') {
    return this.addToast(message, 'info', duration, description);
  }

  render() {
    return html`
      ${this.toasts.map(
        (toast) => html`
          <app-toast
            .id="${toast.id}"
            .message="${toast.message}"
            .type="${toast.type}"
            .duration="${toast.duration}"
            @toast-close="${this._handleToastClose}"
          >
            ${toast.description
              ? html`<div slot="description" class="toast-description">
                  ${toast.description}
                </div>`
              : ''}
          </app-toast>
        `
      )}
    `;
  }
}

customElements.define('toast-manager', ToastManager);
