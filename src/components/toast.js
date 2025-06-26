import {LitElement, html, css} from 'lit';

export class Toast extends LitElement {
  static get properties() {
    return {
      message: {type: String},
      type: {type: String}, // 'success', 'error', 'warning', 'info'
      duration: {type: Number},
      visible: {type: Boolean},
      id: {type: String},
    };
  }

  constructor() {
    super();
    this.message = '';
    this.type = 'info';
    this.duration = 4000;
    this.visible = false;
    this.id = '';
    this._timer = null;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        max-width: 500px;
        pointer-events: auto;
        transition: all 0.3s ease-in-out;
      }

      .toast {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(10px);
        border-left: 4px solid var(--toast-accent-color);
        background: var(--toast-bg-color);
        color: var(--toast-text-color);
        font-size: 14px;
        line-height: 1.4;
        animation: toastSlideIn 0.3s ease-out;
        position: relative;
        overflow: hidden;
      }

      .toast.hide {
        animation: toastSlideOut 0.3s ease-in forwards;
      }

      /* Toast Types */
      .toast.success {
        --toast-bg-color: #f1f8e9;
        --toast-text-color: #2e7d32;
        --toast-accent-color: #4caf50;
        --toast-icon-color: #4caf50;
      }

      .toast.error {
        --toast-bg-color: #ffebee;
        --toast-text-color: #c62828;
        --toast-accent-color: #f44336;
        --toast-icon-color: #f44336;
      }

      .toast.warning {
        --toast-bg-color: #fff3e0;
        --toast-text-color: #ef6c00;
        --toast-accent-color: #ff9800;
        --toast-icon-color: #ff9800;
      }

      .toast.info {
        --toast-bg-color: #e3f2fd;
        --toast-text-color: #1565c0;
        --toast-accent-color: #2196f3;
        --toast-icon-color: #2196f3;
      }

      .toast-icon {
        font-size: 20px;
        color: var(--toast-icon-color);
        flex-shrink: 0;
      }

      .toast-content {
        flex: 1;
      }

      .toast-message {
        margin: 0;
        font-weight: 500;
      }

      .toast-description {
        margin: 4px 0 0 0;
        font-size: 12px;
        opacity: 0.8;
      }

      .toast-close {
        background: none;
        border: none;
        font-size: 18px;
        color: var(--toast-text-color);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        opacity: 0.7;
        transition: opacity 0.2s ease;
        flex-shrink: 0;
      }

      .toast-close:hover {
        opacity: 1;
        background: rgba(0, 0, 0, 0.1);
      }

      .toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: var(--toast-accent-color);
        border-radius: 0 0 8px 8px;
        animation: toastProgress var(--progress-duration, 4000ms) linear
          forwards;
      }

      /* Animations */
      @keyframes toastSlideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes toastSlideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }

      @keyframes toastProgress {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }

      @media (max-width: 768px) {
        :host {
          top: 10px;
          right: 10px;
          left: 10px;
          min-width: auto;
          max-width: none;
        }

        .toast {
          padding: 14px 16px;
          font-size: 13px;
        }

        .toast-icon {
          font-size: 18px;
        }
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._show();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearTimer();
  }

  _show() {
    setTimeout(() => {
      this.visible = true;
      this.requestUpdate();
    }, 10);

    if (this.duration > 0) {
      this._timer = setTimeout(() => {
        this.hide();
      }, this.duration);
    }
  }

  hide() {
    this._clearTimer();
    this.visible = false;
    this.requestUpdate();

    setTimeout(() => {
      this._notifyClose();
    }, 300);
  }

  _clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  _handleClose() {
    this.hide();
  }

  _notifyClose() {
    this.dispatchEvent(
      new CustomEvent('toast-close', {
        detail: {id: this.id},
        bubbles: true,
        composed: true,
      })
    );
  }

  _getIcon() {
    switch (this.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  }

  render() {
    return html`
      <div
        class="toast ${this.type} ${this.visible ? '' : 'hide'}"
        style="--progress-duration: ${this.duration}ms"
      >
        <div class="toast-icon">${this._getIcon()}</div>

        <div class="toast-content">
          <div class="toast-message">
            <slot name="message">${this.message}</slot>
          </div>
          <slot name="description"></slot>
        </div>

        <button
          class="toast-close"
          @click="${this._handleClose}"
          title="Close notification"
        >
          ×
        </button>

        ${this.duration > 0 ? html`<div class="toast-progress"></div>` : ''}
      </div>
    `;
  }
}

customElements.define('app-toast', Toast);
