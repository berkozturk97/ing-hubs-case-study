import {LitElement, html, css} from 'lit';
import '../components/employee-form.js';
import {ReduxLocalizedMixin} from '../localization/redux-localized-mixin.js';

export class CreateEmployeePage extends ReduxLocalizedMixin(LitElement) {
  static get properties() {
    return {
      loading: {type: Boolean},
      error: {type: String},
    };
  }

  constructor() {
    super();
    this.loading = false;
    this.error = null;
  }

  stateChanged(state) {
    super.stateChanged(state);

    this.loading = state.employees.loading;
    this.error = state.employees.error;
  }
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }

      .error-banner {
        background-color: #ffebee;
        color: #c62828;
        padding: 16px;
        border-radius: 6px;
        margin-bottom: 24px;
        border-left: 4px solid #d32f2f;
        text-align: center;
      }

      .success-banner {
        background-color: #e8f5e8;
        color: #2e7d2e;
        padding: 16px;
        border-radius: 6px;
        margin-bottom: 24px;
        border-left: 4px solid #4caf50;
        text-align: center;
      }

      @media (max-width: 768px) {
        :host {
          padding: 16px;
        }
      }
    `;
  }

  _handleEmployeeCreate() {
    this._showSuccessAndNavigate();
  }

  _handleFormCancel() {
    this._navigateToEmployeeList();
  }

  _showSuccessAndNavigate() {
    setTimeout(() => {
      this._navigateToEmployeeList();
    }, 100);
  }

  _navigateToEmployeeList() {
    window.history.pushState({}, '', '/employees');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  render() {
    return html`
      ${this.error
        ? html`
            <div class="error-banner">
              <strong>Error:</strong> ${this.error}
            </div>
          `
        : ''}

      <employee-form
        .loading="${this.loading}"
        @employee-created="${this._handleEmployeeCreate}"
        @form-cancel="${this._handleFormCancel}"
      ></employee-form>
    `;
  }
}

customElements.define('create-employee-page', CreateEmployeePage);
