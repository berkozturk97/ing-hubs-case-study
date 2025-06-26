import {LitElement, html, css} from 'lit';
import '../components/employee-form.js';
import {ReduxLocalizedMixin} from '../localization/redux-localized-mixin.js';

export class EditEmployeePage extends ReduxLocalizedMixin(LitElement) {
  static get properties() {
    return {
      employeeId: {type: String},
      employee: {type: Object},
      loading: {type: Boolean},
      error: {type: String},
    };
  }

  constructor() {
    super();
    this.employeeId = null;
    this.employee = null;
    this.loading = false;
    this.error = null;
  }

  stateChanged(state) {
    super.stateChanged(state);

    this.loading = state.employees.loading;
    this.error = state.employees.error;

    if (this.employeeId && state.employees.list) {
      const foundEmployee = state.employees.list.find(
        (emp) => emp.id === this.employeeId
      );
      this.employee = foundEmployee || null;

      if (!foundEmployee && !this.loading) {
        this.error = 'Employee not found';
      }
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 24px;
        text-align: center;
      }

      .page-title {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px 0;
      }

      .page-subtitle {
        font-size: 14px;
        color: #666;
        margin: 0;
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

      .loading-state {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 60px 20px;
        color: #666;
      }

      .back-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #ff6200;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 20px;
        padding: 8px 0;
        transition: all 0.2s ease;
      }

      .back-button:hover {
        color: #e55100;
        transform: translateX(-2px);
      }

      @media (max-width: 768px) {
        :host {
          padding: 16px;
        }

        .page-title {
          font-size: 20px;
        }
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._extractEmployeeIdFromLocation();
  }

  onBeforeEnter(location) {
    this.employeeId = location.params.id;
    return true;
  }

  _extractEmployeeIdFromLocation() {
    if (!this.employeeId) {
      const path = window.location.pathname;
      const matches = path.match(/\/edit-employee\/(.+)/);
      if (matches && matches[1]) {
        this.employeeId = decodeURIComponent(matches[1]);
      }
    }
  }

  _handleEmployeeUpdate() {
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

  _navigateBack() {
    this._navigateToEmployeeList();
  }

  render() {
    if (this.error || !this.employee) {
      return html`
        <a href="/employees" class="back-button" @click="${this._navigateBack}">
          ← Back to Employee List
        </a>

        <div class="error-banner">
          <strong>Error:</strong> ${this.error || 'Employee not found'}
        </div>
      `;
    }

    return html`
      <a href="/employees" class="back-button" @click="${this._navigateBack}">
        ← Back to Employee List
      </a>

      <div class="page-header">
        <h1 class="page-title">Edit Employee</h1>
        <p class="page-subtitle">
          Update information for ${this.employee.firstName}
          ${this.employee.lastName}
        </p>
      </div>

      ${this.error
        ? html`
            <div class="error-banner">
              <strong>Error:</strong> ${this.error}
            </div>
          `
        : ''}

      <employee-form
        .employee="${this.employee}"
        .isEditMode="${true}"
        .loading="${this.loading}"
        @employee-updated="${this._handleEmployeeUpdate}"
        @form-cancel="${this._handleFormCancel}"
      ></employee-form>
    `;
  }
}

customElements.define('edit-employee-page', EditEmployeePage);
