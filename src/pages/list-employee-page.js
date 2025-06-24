import {LitElement, html, css} from 'lit';

export class ListEmployeePage extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 40px 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .page-container {
        background: white;
        border-radius: 8px;
        padding: 32px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .page-title {
        font-size: 32px;
        color: #333;
        margin-bottom: 24px;
        font-weight: 600;
      }
    `;
  }

  render() {
    return html`
      <div class="page-container">
        <h1 class="page-title">Employee List</h1>
      </div>
    `;
  }
}

customElements.define('list-employee-page', ListEmployeePage);
