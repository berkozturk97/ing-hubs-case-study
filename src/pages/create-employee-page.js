import {LitElement, html, css} from 'lit';
import {connect} from 'pwa-helpers/connect-mixin.js';
import {store} from '../store/index.js';
import {addEmployeeAsync} from '../store/actions/employees.js';
import {t} from '../localization/index.js';

export class CreateEmployeePage extends connect(store)(LitElement) {
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
    this.loading = state.employees.loading;
    this.error = state.employees.error;
  }
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 40px 20px;
        max-width: 800px;
        margin: 0 auto;
      }

      .page-container {
        background: white;
        border-radius: 8px;
        padding: 32px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
      }

      .page-title {
        font-size: 32px;
        color: #333;
        margin-bottom: 16px;
        font-weight: 600;
      }

      .test-button {
        background-color: #ff6200;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        margin: 20px 0;
        transition: background-color 0.3s ease;
      }

      .test-button:hover {
        background-color: #e55100;
      }

      .test-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }

      .error-message {
        color: #d32f2f;
        background-color: #ffebee;
        padding: 12px;
        border-radius: 6px;
        margin: 16px 0;
        border: 1px solid #ffcdd2;
      }

      .coming-soon {
        font-size: 14px;
        color: #ff6200;
        background-color: #fff3e0;
        padding: 12px 24px;
        border-radius: 6px;
        display: inline-block;
        border: 1px solid #ffcc80;
        margin-top: 20px;
      }
    `;
  }

  _addSampleEmployee() {
    const sampleEmployee = {
      firstName: 'John',
      lastName: 'Doe',
      email: `john.doe.${Date.now()}@example.com`,
      phone: '+1234567890',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: new Date().toISOString().split('T')[0],
      department: 'Tech',
      position: 'Senior',
    };

    store
      .dispatch(addEmployeeAsync(sampleEmployee))
      .then(() => {
        window.history.pushState({}, '', '/employees');
        window.dispatchEvent(new PopStateEvent('popstate'));
      })
      .catch((error) => {
        console.error('Failed to add employee:', error);
      });
  }

  render() {
    return html`
      <div class="page-container">
        <h1 class="page-title">${t('employees.addEmployee')}</h1>

        <button
          class="test-button"
          @click="${this._addSampleEmployee}"
          ?disabled="${this.loading}"
        >
          ${this.loading ? 'Adding...' : 'Add Sample Employee'}
        </button>

        ${this.error
          ? html` <div class="error-message">${this.error}</div> `
          : ''}

        <div class="coming-soon">
          🚧 Full Employee Creation Form - Coming Soon
        </div>
      </div>
    `;
  }
}

customElements.define('create-employee-page', CreateEmployeePage);
