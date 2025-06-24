import {LitElement, html, css} from 'lit';

export class CustomButton extends LitElement {
  static get properties() {
    return {
      variant: {type: String}, // 'primary', 'secondary', 'danger', 'outline'
      size: {type: String}, // 'small', 'medium', 'large'
      disabled: {type: Boolean},
      loading: {type: Boolean},
      fullWidth: {type: Boolean},
      type: {type: String}, // 'button', 'submit', 'reset'
    };
  }

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'medium';
    this.disabled = false;
    this.loading = false;
    this.fullWidth = false;
    this.type = 'button';
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      :host([full-width]) {
        display: block;
        width: 100%;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: none;
        border-radius: 6px;
        font-family: inherit;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
      }

      :host([full-width]) .button {
        width: 100%;
      }

      .button:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.2);
      }

      .button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
      }

      /* Variants */
      .button.primary {
        background-color: #ff6200;
        color: white;
        border: 2px solid #ff6200;
      }

      .button.primary:hover:not(:disabled) {
        background-color: #e55100;
        border-color: #e55100;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 98, 0, 0.3);
      }

      .button.primary:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(255, 98, 0, 0.3);
      }

      .button.secondary {
        background-color: #f5f5f5;
        color: #333;
        border: 2px solid #e0e0e0;
      }

      .button.secondary:hover:not(:disabled) {
        background-color: #e9e9e9;
        border-color: #ccc;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .button.secondary:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .button.danger {
        background-color: #d32f2f;
        color: white;
        border: 2px solid #d32f2f;
      }

      .button.danger:hover:not(:disabled) {
        background-color: #b71c1c;
        border-color: #b71c1c;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
      }

      .button.danger:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(211, 47, 47, 0.3);
      }

      .button.outline {
        background-color: transparent;
        color: #ff6200;
        border: 2px solid #ff6200;
      }

      .button.outline:hover:not(:disabled) {
        background-color: #ff6200;
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 98, 0, 0.2);
      }

      .button.outline:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(255, 98, 0, 0.2);
      }

      /* Sizes */
      .button.small {
        padding: 6px 12px;
        font-size: 12px;
        min-height: 32px;
      }

      .button.medium {
        padding: 10px 20px;
        font-size: 14px;
        min-height: 40px;
      }

      .button.large {
        padding: 14px 28px;
        font-size: 16px;
        min-height: 48px;
      }

      /* Loading state */
      .button.loading {
        color: transparent;
      }

      .loading-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .button.loading .loading-spinner {
        color: white;
      }

      .button.outline.loading .loading-spinner,
      .button.secondary.loading .loading-spinner {
        color: #ff6200;
      }

      @keyframes spin {
        0% {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
          transform: translate(-50%, -50%) rotate(360deg);
        }
      }

      /* Icon support */
      .button-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      ::slotted([slot='icon']) {
        font-size: 1.2em;
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .button.large {
          padding: 12px 24px;
          font-size: 14px;
          min-height: 44px;
        }

        .button.medium {
          padding: 8px 16px;
          font-size: 13px;
          min-height: 36px;
        }

        .button.small {
          padding: 6px 10px;
          font-size: 11px;
          min-height: 30px;
        }
      }
    `;
  }

  _handleClick(event) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.type === 'submit') {
      const form = this.closest('form');
      if (form) {
        const submitEvent = new Event('submit', {
          bubbles: true,
          cancelable: true,
        });
        form.dispatchEvent(submitEvent);
      }
      return;
    }

    this.dispatchEvent(
      new CustomEvent('button-click', {
        detail: {originalEvent: event},
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const classes = [
      'button',
      this.variant,
      this.size,
      this.loading ? 'loading' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <button
        class="${classes}"
        type="${this.type}"
        ?disabled="${this.disabled || this.loading}"
        @click="${this._handleClick}"
      >
        ${this.loading ? html`<div class="loading-spinner"></div>` : ''}
        <div class="button-content">
          <slot name="icon"></slot>
          <slot></slot>
        </div>
      </button>
    `;
  }
}

customElements.define('custom-button', CustomButton);
