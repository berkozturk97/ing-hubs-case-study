import {LitElement, html, css} from 'lit';

export class LoadingSpinner extends LitElement {
  static get properties() {
    return {
      size: {type: String}, // 'small', 'medium', 'large'
      color: {type: String},
      message: {type: String},
      overlay: {type: Boolean, reflect: true}, // For full-screen overlay
    };
  }

  constructor() {
    super();
    this.size = 'medium';
    this.color = '#ff6200';
    this.message = '';
    this.overlay = false;
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      :host([overlay]) {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(2px);
      }

      .spinner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }

      .spinner {
        border: 2px solid transparent;
        border-top: 2px solid var(--spinner-color, #ff6200);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .spinner.small {
        width: 16px;
        height: 16px;
        border-width: 2px;
      }

      .spinner.medium {
        width: 24px;
        height: 24px;
        border-width: 2px;
      }

      .spinner.large {
        width: 32px;
        height: 32px;
        border-width: 3px;
      }

      .spinner.overlay-size {
        width: 40px;
        height: 40px;
        border-width: 4px;
      }

      .message {
        font-size: 14px;
        color: #666;
        text-align: center;
        font-weight: 500;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      :host([overlay]) .spinner-container {
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.8;
        }
      }
    `;
  }

  render() {
    const spinnerSize = this.overlay ? 'overlay-size' : this.size;

    return html`
      <div class="spinner-container">
        <div
          class="spinner ${spinnerSize}"
          style="--spinner-color: ${this.color}"
        ></div>
        ${this.message ? html`<div class="message">${this.message}</div>` : ''}
      </div>
    `;
  }
}

customElements.define('loading-spinner', LoadingSpinner);
