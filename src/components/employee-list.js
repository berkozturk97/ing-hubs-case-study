import {LitElement, html, css} from 'lit';
import {ReduxLocalizedMixin} from '../localization/redux-localized-mixin.js';
import './pagination.js';
import './confirmation-modal.js';

export class EmployeeList extends ReduxLocalizedMixin(LitElement) {
  static get properties() {
    return {
      employees: {type: Array},
      loading: {type: Boolean},
      currentPage: {type: Number},
      itemsPerPage: {type: Number},
      employeeToDelete: {type: Object},
      deleteModalOpen: {type: Boolean},
      deleteLoading: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.employees = [];
    this.loading = false;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.employeeToDelete = null;
    this.deleteModalOpen = false;
    this.deleteLoading = false;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
      }

      .list-container {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #e0e0e0;
        max-width: 100%;
        width: 100%;
        overflow: hidden;
      }

      .employee-cards {
        padding: 16px;
        display: grid;
        gap: 16px;
        grid-template-columns: 1fr;
      }

      .employee-card {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        background: white;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .employee-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
        border-color: #ff6200;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 12px;
      }

      .employee-info {
        flex: 1;
        min-width: 200px;
      }

      .employee-name {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0 0 4px 0;
      }

      .employee-title {
        color: #666;
        font-size: 14px;
        margin: 0 0 8px 0;
      }

      .badges-container {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .department-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .department-tech {
        background-color: #e3f2fd;
        color: #1976d2;
      }

      .department-analytics {
        background-color: #f3e5f5;
        color: #7b1fa2;
      }

      .position-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .position-junior {
        background-color: #fff3e0;
        color: #f57c00;
      }

      .position-medior {
        background-color: #e8f5e8;
        color: #388e3c;
      }

      .position-senior {
        background-color: #ffebee;
        color: #d32f2f;
      }

      .card-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 16px;
      }

      .detail-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .detail-label {
        font-size: 12px;
        color: #888;
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 0.5px;
      }

      .detail-value {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }

      .detail-value.email {
        color: #1976d2;
        text-decoration: none;
      }

      .detail-value.email:hover {
        text-decoration: underline;
      }

      .card-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 16px;
        border-top: 1px solid #f0f0f0;
      }

      .action-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 16px;
        border-radius: 6px;
        border: 1px solid;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
        gap: 6px;
      }

      .edit-button {
        color: #1976d2;
        background-color: #e3f2fd;
        border-color: #bbdefb;
      }

      .edit-button:hover {
        background-color: #bbdefb;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
      }

      .delete-button {
        color: #d32f2f;
        background-color: #ffebee;
        border-color: #ffcdd2;
      }

      .delete-button:hover {
        background-color: #ffcdd2;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(211, 47, 47, 0.2);
      }

      .delete-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #666;
      }

      .empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      .loading-overlay {
        position: relative;
      }

      .loading-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
      }

      .loading-content {
        opacity: 0.5;
        pointer-events: none;
      }

      @media (max-width: 768px) {
        .employee-cards {
          padding: 12px;
          gap: 12px;
        }

        .employee-card {
          padding: 16px;
        }

        .card-header {
          flex-direction: column;
          align-items: stretch;
        }

        .card-details {
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .card-actions {
          flex-direction: column;
        }

        .action-button {
          justify-content: center;
        }
      }

      @media (max-width: 480px) {
        .employee-cards {
          padding: 8px;
        }

        .employee-card {
          padding: 12px;
        }

        .employee-name {
          font-size: 16px;
        }

        .badges-container {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `;
  }

  _formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(this.locale || 'en-US');
  }

  _formatPhone(phone) {
    return phone || '';
  }

  _getDepartmentClass(department) {
    switch (department?.toLowerCase()) {
      case 'tech':
        return 'department-tech';
      case 'analytics':
        return 'department-analytics';
      default:
        return 'department-tech';
    }
  }

  _getPositionClass(position) {
    switch (position?.toLowerCase()) {
      case 'junior':
        return 'position-junior';
      case 'medior':
        return 'position-medior';
      case 'senior':
        return 'position-senior';
      default:
        return 'position-junior';
    }
  }

  _handleEdit(employee) {
    window.history.pushState({}, '', `/edit-employee/${employee.id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _handleDelete(employee) {
    this.employeeToDelete = employee;
    this.deleteModalOpen = true;
  }

  _handleDeleteConfirmed() {
    if (this.employeeToDelete) {
      this.deleteLoading = true;
      this.dispatchEvent(
        new CustomEvent('employee-delete', {
          detail: {employee: this.employeeToDelete},
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  _handleDeleteCancelled() {
    this.deleteModalOpen = false;
    this.employeeToDelete = null;
    this.deleteLoading = false;
  }

  closeDeleteModal() {
    this.deleteModalOpen = false;
    this.employeeToDelete = null;
    this.deleteLoading = false;
  }

  _handlePageChange(event) {
    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: event.detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleItemsPerPageChange(event) {
    this.dispatchEvent(
      new CustomEvent('items-per-page-change', {
        detail: event.detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  get paginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.employees.slice(startIndex, endIndex);
  }

  render() {
    const paginatedEmployees = this.paginatedEmployees;

    if (this.employees.length === 0) {
      return html`
        <div class="list-container">
          <div class="empty-state">
            <div class="empty-icon">👥</div>
            <h3>${this.t('common.noEmployees')}</h3>
            <p>${this.t('common.addFirstEmployee')}</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="list-container">
        <div class="employee-cards ${this.loading ? 'loading-content' : ''}">
          ${paginatedEmployees.map(
            (employee) => html`
              <div class="employee-card">
                <div class="card-header">
                  <div class="employee-info">
                    <h3 class="employee-name">
                      ${employee.firstName} ${employee.lastName}
                    </h3>
                    <p class="employee-title">
                      ${employee.position} ${this.t('common.in')}
                      ${employee.department}
                    </p>
                    <div class="badges-container">
                      <span
                        class="department-badge ${this._getDepartmentClass(
                          employee.department
                        )}"
                      >
                        ${employee.department}
                      </span>
                      <span
                        class="position-badge ${this._getPositionClass(
                          employee.position
                        )}"
                      >
                        ${employee.position}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="card-details">
                  <div class="detail-item">
                    <span class="detail-label"
                      >${this.t('employee.email')}</span
                    >
                    <a
                      href="mailto:${employee.email}"
                      class="detail-value email"
                    >
                      ${employee.email}
                    </a>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label"
                      >${this.t('employee.phone')}</span
                    >
                    <span class="detail-value"
                      >${this._formatPhone(employee.phone)}</span
                    >
                  </div>
                  <div class="detail-item">
                    <span class="detail-label"
                      >${this.t('employee.dateOfEmployment')}</span
                    >
                    <span class="detail-value"
                      >${this._formatDate(employee.dateOfEmployment)}</span
                    >
                  </div>
                  <div class="detail-item">
                    <span class="detail-label"
                      >${this.t('employee.dateOfBirth')}</span
                    >
                    <span class="detail-value"
                      >${this._formatDate(employee.dateOfBirth)}</span
                    >
                  </div>
                </div>

                <div class="card-actions">
                  <button
                    class="action-button edit-button"
                    @click="${() => this._handleEdit(employee)}"
                    title="${this.t('common.edit')}"
                  >
                    ✏️ ${this.t('common.edit')}
                  </button>
                  <button
                    class="action-button delete-button"
                    @click="${() => this._handleDelete(employee)}"
                    title="${this.t('common.delete')}"
                    ?disabled="${this.deleteLoading}"
                  >
                    🗑️ ${this.t('common.delete')}
                  </button>
                </div>
              </div>
            `
          )}
        </div>

        <app-pagination
          .currentPage="${this.currentPage}"
          .totalItems="${this.employees.length}"
          .itemsPerPage="${this.itemsPerPage}"
          @page-change="${this._handlePageChange}"
          @items-per-page-change="${this._handleItemsPerPageChange}"
        ></app-pagination>

        <confirmation-modal
          ?open="${this.deleteModalOpen}"
          .title="${this.t('modal.confirmDelete')}"
          .message="${this.t('modal.deleteEmployeeConfirm', {
            name: this.employeeToDelete
              ? `${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName}`
              : '',
          })}"
          .confirmText="${this.t('common.delete')}"
          .cancelText="${this.t('common.cancel')}"
          .loading="${this.deleteLoading}"
          confirmType="danger"
          @confirm="${this._handleDeleteConfirmed}"
          @cancel="${this._handleDeleteCancelled}"
        ></confirmation-modal>
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
