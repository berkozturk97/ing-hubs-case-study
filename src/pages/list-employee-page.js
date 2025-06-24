import {LitElement, html, css} from 'lit';
import {connect} from 'pwa-helpers/connect-mixin.js';
import {store} from '../store/index.js';
import {t} from '../localization/index.js';
import '../components/employee-table.js';

export class ListEmployeePage extends connect(store)(LitElement) {
  static get properties() {
    return {
      employees: {type: Array},
      loading: {type: Boolean},
      error: {type: String},
      viewMode: {type: String},
    };
  }

  constructor() {
    super();
    this.employees = [];
    this.loading = false;
    this.error = null;
    this.viewMode = 'table';
  }

  stateChanged(state) {
    this.employees = state.employees.list;
    this.loading = state.employees.loading;
    this.error = state.employees.error;
    this.viewMode = state.ui.viewMode;
  }
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

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      }

      .view-toggle {
        display: flex;
        gap: 8px;
      }

      .view-button {
        padding: 8px 16px;
        border: 1px solid #e0e0e0;
        background: white;
        color: #666;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .view-button:hover {
        background-color: #f5f5f5;
      }

      .view-button.active {
        background-color: #ff6200;
        color: white;
        border-color: #ff6200;
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
      }

      .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .empty-title {
        font-size: 24px;
        color: #333;
        margin-bottom: 8px;
        font-weight: 500;
      }

      .empty-description {
        font-size: 16px;
        color: #666;
        margin-bottom: 24px;
      }

      .add-button {
        background-color: #ff6200;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;
        text-decoration: none;
        display: inline-block;
      }

      .add-button:hover {
        background-color: #e55100;
      }

      .employee-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .employee-card {
        background: #f9f9f9;
        border-radius: 8px;
        padding: 20px;
        border-left: 4px solid #ff6200;
        transition: transform 0.2s ease;
      }

      .employee-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .employee-card h3 {
        margin: 0 0 12px 0;
        color: #333;
        font-size: 18px;
      }

      .employee-card p {
        margin: 8px 0;
        color: #666;
        font-size: 14px;
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        :host {
          padding: 20px 16px;
        }

        .page-container {
          padding: 24px 16px;
        }

        .page-title {
          font-size: 24px;
        }

        .empty-icon {
          font-size: 48px;
        }

        .empty-title {
          font-size: 20px;
        }

        .empty-description {
          font-size: 14px;
        }

        .employee-list {
          grid-template-columns: 1fr;
        }
      }
    `;
  }

  _handleViewModeChange(mode) {
    // Will implement Redux action later
    this.viewMode = mode;
  }

  _handleEmployeeEdit(event) {
    console.log('Edit employee:', event.detail.employee);
    // TODO: Navigate to edit page or open edit modal
  }

  _handleEmployeeDelete(event) {
    console.log('Delete employee:', event.detail.employee);
    // TODO: Show confirmation dialog and delete employee
  }

  render() {
    return html`
      <div class="page-container">
        <div class="page-header">
          <h1 class="page-title">${t('employees.title')}</h1>

          <div class="view-toggle">
            <button
              class="view-button ${this.viewMode === 'list' ? 'active' : ''}"
              @click="${() => this._handleViewModeChange('list')}"
            >
              📋 ${t('employees.viewModeList')}
            </button>
            <button
              class="view-button ${this.viewMode === 'table' ? 'active' : ''}"
              @click="${() => this._handleViewModeChange('table')}"
            >
              📊 ${t('employees.viewModeTable')}
            </button>
          </div>
        </div>

        ${this.employees.length === 0
          ? html`
              <div class="empty-state">
                <div class="empty-icon">👥</div>
                <h2 class="empty-title">${t('employees.noEmployees')}</h2>
                <p class="empty-description">
                  Get started by adding your first employee to the system.
                </p>
                <a href="/add-employee" class="add-button">
                  ${t('employees.addEmployee')}
                </a>
              </div>
            `
          : html`
              ${this.viewMode === 'table'
                ? html`
                    <employee-table
                      .employees="${this.employees}"
                      .loading="${this.loading}"
                      @employee-edit="${this._handleEmployeeEdit}"
                      @employee-delete="${this._handleEmployeeDelete}"
                    ></employee-table>
                  `
                : html`
                    <div class="employee-list">
                      ${this.employees.map(
                        (employee) => html`
                          <div class="employee-card">
                            <h3>${employee.firstName} ${employee.lastName}</h3>
                            <p>📧 ${employee.email}</p>
                            <p>🏢 ${employee.department}</p>
                            <p>💼 ${employee.position}</p>
                            <p>
                              📅
                              ${new Date(
                                employee.dateOfEmployment
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        `
                      )}
                    </div>
                  `}
            `}
      </div>
    `;
  }
}

customElements.define('list-employee-page', ListEmployeePage);
