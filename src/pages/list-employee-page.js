import {LitElement, html, css} from 'lit';
import {ReduxLocalizedMixin} from '../localization/redux-localized-mixin.js';
import {store} from '../store/index.js';
import {
  setViewMode,
  setCurrentPage,
  setItemsPerPage,
  setSearchFilter,
} from '../store/actions/ui.js';
import {deleteEmployeeAsync} from '../store/actions/employees.js';
import {toastService} from '../utils/toast-service.js';
import '../components/loading-spinner.js';
import '../components/employee-table.js';
import '../components/employee-list.js';
import '../components/search-bar.js';

export class ListEmployeePage extends ReduxLocalizedMixin(LitElement) {
  static get properties() {
    return {
      employees: {type: Array},
      loading: {type: Boolean},
      viewMode: {type: String},
      currentPage: {type: Number},
      itemsPerPage: {type: Number},
      searchTerm: {type: String},
    };
  }

  constructor() {
    super();
    this.employees = [];
    this.loading = false;
    this.viewMode = 'table';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.searchTerm = '';
  }

  stateChanged(state) {
    super.stateChanged(state);

    const allEmployees = state.employees?.list || [];
    this.searchTerm = state.ui?.filters?.search || '';

    // Filter employees based on search term
    this.employees = this._filterEmployees(allEmployees, this.searchTerm);

    this.loading = state.employees?.loading || false;
    this.viewMode = state.ui?.viewMode || 'table';
    this.currentPage = state.ui?.pagination?.currentPage || 1;
    this.itemsPerPage = state.ui?.pagination?.itemsPerPage || 10;
  }

  _filterEmployees(employees, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return employees;
    }

    const lowercaseSearch = searchTerm.toLowerCase().trim();

    return employees.filter((employee) => {
      const searchableFields = [
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.phoneNumber,
        employee.department,
        employee.position,
      ];

      return searchableFields.some(
        (field) =>
          field && field.toString().toLowerCase().includes(lowercaseSearch)
      );
    });
  }
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      }

      .page-title {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }

      .view-controls {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .search-section {
        margin-bottom: 24px;
      }

      .search-section search-bar {
        max-width: 400px;
      }

      .view-toggle {
        display: flex;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        overflow: hidden;
        background: white;
      }

      .view-button {
        padding: 8px 16px;
        border: none;
        background: white;
        color: #666;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .view-button:hover {
        background-color: #f5f5f5;
      }

      .view-button.active {
        background-color: #ff6200;
        color: white;
      }

      .content-area {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .loading-state {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 60px 20px;
        color: #666;
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

      @media (max-width: 768px) {
        :host {
          padding: 16px;
        }

        .page-header {
          flex-direction: column;
          align-items: stretch;
        }

        .view-controls {
          justify-content: center;
        }

        .search-section search-bar {
          max-width: 100%;
        }
      }
    `;
  }

  _handleViewModeChange(mode) {
    store.dispatch(setViewMode(mode));
  }

  _handlePageChange(event) {
    const {page} = event.detail;
    store.dispatch(setCurrentPage(page));
  }

  _handleItemsPerPageChange(event) {
    const {itemsPerPage} = event.detail;
    store.dispatch(setItemsPerPage(itemsPerPage));
  }

  _handleSearch(event) {
    const {searchTerm} = event.detail;
    store.dispatch(setSearchFilter(searchTerm));
  }

  _handleEmployeeDelete(event) {
    const {employee} = event.detail;

    store
      .dispatch(deleteEmployeeAsync(employee.id))
      .then(() => {
        toastService.success(
          this.t('toast.employeeDeleted'),
          4000,
          this.t('toast.employeeDeletedDesc')
        );

        const table = this.shadowRoot.querySelector('employee-table');
        const list = this.shadowRoot.querySelector('employee-list');
        if (table) {
          table.closeDeleteModal();
        }
        if (list) {
          list.closeDeleteModal();
        }
      })
      .catch((error) => {
        console.error('Delete failed:', error);

        toastService.error(
          this.t('toast.deleteError'),
          6000,
          error.message || 'An unexpected error occurred'
        );

        const table = this.shadowRoot.querySelector('employee-table');
        const list = this.shadowRoot.querySelector('employee-list');
        if (table) {
          table.closeDeleteModal();
        }
        if (list) {
          list.closeDeleteModal();
        }
      });
  }

  render() {
    return html`
      <div class="page-header">
        <h1 class="page-title">${this.t('navigation.employees')}</h1>
        <div class="view-controls">
          <div class="view-toggle">
            <button
              class="view-button ${this.viewMode === 'table' ? 'active' : ''}"
              @click="${() => this._handleViewModeChange('table')}"
            >
              📊 ${this.t('common.table')}
            </button>
            <button
              class="view-button ${this.viewMode === 'list' ? 'active' : ''}"
              @click="${() => this._handleViewModeChange('list')}"
            >
              📋 ${this.t('common.list')}
            </button>
          </div>
        </div>
      </div>

      <div class="search-section">
        <search-bar
          @search="${this._handleSearch}"
          ?disabled="${this.loading}"
        ></search-bar>
      </div>

      <div class="content-area">
        ${this.loading
          ? html`
              <loading-spinner
                overlay
                size="large"
                message="${this.t('common.deleting')}"
              ></loading-spinner>
            `
          : this.employees.length === 0
          ? html`
              <div class="empty-state">
                <div class="empty-icon">👥</div>
                <div>No employees found</div>
                <p>Start by adding your first employee.</p>
              </div>
            `
          : this.viewMode === 'table'
          ? html`
              <employee-table
                .employees="${this.employees}"
                .loading="${this.loading}"
                .currentPage="${this.currentPage}"
                .itemsPerPage="${this.itemsPerPage}"
                @page-change="${this._handlePageChange}"
                @items-per-page-change="${this._handleItemsPerPageChange}"
                @employee-delete="${this._handleEmployeeDelete}"
              ></employee-table>
            `
          : html`
              <employee-list
                .employees="${this.employees}"
                .loading="${this.loading}"
                .currentPage="${this.currentPage}"
                .itemsPerPage="${this.itemsPerPage}"
                @page-change="${this._handlePageChange}"
                @items-per-page-change="${this._handleItemsPerPageChange}"
                @employee-delete="${this._handleEmployeeDelete}"
              ></employee-list>
            `}
      </div>
    `;
  }
}

customElements.define('list-employee-page', ListEmployeePage);
