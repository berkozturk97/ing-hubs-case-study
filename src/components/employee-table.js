import {LitElement, html, css} from 'lit';
import {ReduxLocalizedMixin} from '../localization/redux-localized-mixin.js';
import './pagination.js';
import './confirmation-modal.js';

export class EmployeeTable extends ReduxLocalizedMixin(LitElement) {
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

      .table-container {
        overflow-x: auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #e0e0e0;
        max-width: 100%;
        width: 100%;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
        min-width: 900px;
        table-layout: auto;
      }

      .table-header {
        background-color: #f8f9fa;
        border-bottom: 2px solid #e0e0e0;
      }

      .table-header th {
        padding: 16px 8px;
        text-align: left;
        font-weight: 600;
        color: #333;
        border-right: 1px solid #e0e0e0;
        white-space: nowrap;
        font-size: 13px;
      }

      .table-header th:last-child {
        border-right: none;
      }

      .table-row {
        border-bottom: 1px solid #e0e0e0;
        transition: background-color 0.2s ease;
      }

      .table-row:nth-child(even) {
        background-color: #f8f9fa;
      }

      .table-row:hover {
        background-color: #e3f2fd !important;
      }

      .table-row:last-child {
        border-bottom: none;
      }

      .table-cell {
        padding: 12px 8px;
        color: #666;
        border-right: 1px solid #f0f0f0;
        vertical-align: middle;
        font-size: 13px;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .table-cell.email-cell {
        max-width: 200px;
      }

      .table-cell.name-cell {
        max-width: 120px;
      }

      .table-cell.action-cell {
        max-width: 100px;
        white-space: normal;
      }

      .table-cell:last-child {
        border-right: none;
      }

      .employee-name {
        font-weight: 500;
        color: #333;
      }

      .department-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
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
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
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

      .actions-container {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .action-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        background: none;
      }

      .edit-button {
        color: #1976d2;
        background-color: #e3f2fd;
      }

      .edit-button:hover {
        background-color: #bbdefb;
        transform: translateY(-1px);
      }

      .delete-button {
        color: #d32f2f;
        background-color: #ffebee;
      }

      .delete-button:hover {
        background-color: #ffcdd2;
        transform: translateY(-1px);
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #666;
      }

      .empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .loading-state {
        text-align: center;
        padding: 40px 20px;
        color: #666;
      }

      @media (max-width: 1200px) {
        .table {
          min-width: 800px;
        }

        .table-header th,
        .table-cell {
          padding: 12px 6px;
          font-size: 12px;
        }
      }

      @media (max-width: 1024px) {
        .hide-mobile {
          display: none;
        }

        .table {
          min-width: 600px;
        }
      }

      @media (max-width: 768px) {
        .table-header th,
        .table-cell {
          padding: 8px 4px;
          font-size: 11px;
        }

        .action-button {
          width: 26px;
          height: 26px;
        }

        .department-badge,
        .position-badge {
          font-size: 9px;
          padding: 2px 4px;
        }

        .table {
          min-width: 500px;
        }

        .table-cell {
          max-width: 100px;
        }

        .table-cell.email-cell {
          max-width: 140px;
        }

        .table-cell.name-cell {
          max-width: 80px;
        }
      }
    `;
  }

  _formatDate(dateString) {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return '-';
    }
  }

  _formatPhone(phone) {
    if (!phone) return '-';
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
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

  _getLocalizedDepartment(department) {
    const key = department?.toLowerCase();
    return this.t(`departments.${key}`) || department;
  }

  _getLocalizedPosition(position) {
    const key = position?.toLowerCase();
    return this.t(`positions.${key}`) || position;
  }

  _handleEdit(employee) {
    window.history.pushState({}, '', `/edit-employee/${employee.id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _handleDelete(employee) {
    this.employeeToDelete = employee;
    this.deleteModalOpen = true;
    const modal = this.shadowRoot.querySelector('confirmation-modal');
    if (modal) {
      modal.openModal();
    }
  }

  _handleDeleteConfirmed() {
    this.deleteLoading = true;

    this.dispatchEvent(
      new CustomEvent('employee-delete', {
        detail: {employee: this.employeeToDelete},
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleDeleteCancelled() {
    this.employeeToDelete = null;
    this.deleteModalOpen = false;
    this.deleteLoading = false;
  }

  closeDeleteModal() {
    this.employeeToDelete = null;
    this.deleteModalOpen = false;
    this.deleteLoading = false;
    const modal = this.shadowRoot.querySelector('confirmation-modal');
    if (modal) {
      modal.closeModal();
    }
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
    if (!this.employees || this.employees.length === 0) {
      return [];
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.employees.slice(startIndex, endIndex);
  }

  render() {
    if (!this.employees || this.employees.length === 0) {
      return html`
        <div class="empty-state">
          <div class="empty-icon">👥</div>
          <div>No employees found</div>
        </div>
      `;
    }

    return html`
      <div class="table-container">
        <table class="table">
          <thead class="table-header">
            <tr>
              <th>${this.t('employeeForm.firstName')}</th>
              <th>${this.t('employeeForm.lastName')}</th>
              <th>${this.t('employeeForm.dateOfEmployment')}</th>
              <th class="hide-mobile">${this.t('employeeForm.dateOfBirth')}</th>
              <th class="hide-mobile">${this.t('employeeForm.phoneNumber')}</th>
              <th>${this.t('employeeForm.emailAddress')}</th>
              <th>${this.t('employeeForm.department')}</th>
              <th>${this.t('employeeForm.position')}</th>
              <th>${this.t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.paginatedEmployees.map(
              (employee) => html`
                <tr class="table-row">
                  <td
                    class="table-cell name-cell"
                    title="${employee.firstName || '-'}"
                  >
                    <div class="employee-name">
                      ${employee.firstName || '-'}
                    </div>
                  </td>
                  <td
                    class="table-cell name-cell"
                    title="${employee.lastName || '-'}"
                  >
                    <div class="employee-name">${employee.lastName || '-'}</div>
                  </td>
                  <td
                    class="table-cell"
                    title="${this._formatDate(employee.dateOfEmployment)}"
                  >
                    ${this._formatDate(employee.dateOfEmployment)}
                  </td>
                  <td
                    class="table-cell hide-mobile"
                    title="${this._formatDate(employee.dateOfBirth)}"
                  >
                    ${this._formatDate(employee.dateOfBirth)}
                  </td>
                  <td
                    class="table-cell hide-mobile"
                    title="${this._formatPhone(employee.phone)}"
                  >
                    ${this._formatPhone(employee.phone)}
                  </td>
                  <td
                    class="table-cell email-cell"
                    title="${employee.email || '-'}"
                  >
                    ${employee.email || '-'}
                  </td>
                  <td class="table-cell">
                    <span
                      class="department-badge ${this._getDepartmentClass(
                        employee.department
                      )}"
                    >
                      ${this._getLocalizedDepartment(employee.department) ||
                      '-'}
                    </span>
                  </td>
                  <td class="table-cell">
                    <span
                      class="position-badge ${this._getPositionClass(
                        employee.position
                      )}"
                    >
                      ${this._getLocalizedPosition(employee.position) || '-'}
                    </span>
                  </td>
                  <td class="table-cell action-cell">
                    <div class="actions-container">
                      <button
                        class="action-button edit-button"
                        @click="${() => this._handleEdit(employee)}"
                        title="Edit Employee"
                      >
                        ✏️
                      </button>
                      <button
                        class="action-button delete-button"
                        @click="${() => this._handleDelete(employee)}"
                        title="Delete Employee"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>

      <app-pagination
        .currentPage="${this.currentPage}"
        .totalItems="${this.employees?.length || 0}"
        .itemsPerPage="${this.itemsPerPage}"
        @page-change="${this._handlePageChange}"
        @items-per-page-change="${this._handleItemsPerPageChange}"
      ></app-pagination>

      <confirmation-modal
        ?open="${this.deleteModalOpen}"
        title="${this.t('deleteModal.title')}"
        message="${this.t('deleteModal.message')}"
        warningText="${this.t('deleteModal.warning')}"
        confirmButtonText="${this.t('deleteModal.confirmButton')}"
        cancelButtonText="${this.t('deleteModal.cancelButton')}"
        confirmButtonVariant="danger"
        ?loading="${this.deleteLoading}"
        .data="${this.employeeToDelete
          ? {
              title: `${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName}`,
              details: `${this._getLocalizedDepartment(
                this.employeeToDelete.department
              )} - ${this._getLocalizedPosition(
                this.employeeToDelete.position
              )}`,
            }
          : null}"
        @confirmation-confirmed="${this._handleDeleteConfirmed}"
        @confirmation-cancelled="${this._handleDeleteCancelled}"
      ></confirmation-modal>
    `;
  }
}

customElements.define('employee-table', EmployeeTable);
