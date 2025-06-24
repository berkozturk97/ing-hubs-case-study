import {LitElement, html, css} from 'lit';
import {connect} from 'pwa-helpers/connect-mixin.js';
import {store} from '../store/index.js';
import {t} from '../localization/index.js';
import {
  setViewMode,
  setCurrentPage,
  setItemsPerPage,
} from '../store/actions/ui.js';
import '../components/employee-table.js';

export class ListEmployeePage extends connect(store)(LitElement) {
  static get properties() {
    return {
      employees: {type: Array},
      loading: {type: Boolean},
      viewMode: {type: String},
      currentPage: {type: Number},
      itemsPerPage: {type: Number},
    };
  }

  constructor() {
    super();
    this.employees = [];
    this.loading = false;
    this.viewMode = 'table';
    this.currentPage = 1;
    this.itemsPerPage = 10;
  }

  stateChanged(state) {
    this.employees = state.employees.list || [];
    this.loading = state.employees.loading || false;
    this.viewMode = state.ui.viewMode || 'table';
    this.currentPage = state.ui.pagination.currentPage || 1;
    this.itemsPerPage = state.ui.pagination.itemsPerPage || 10;
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

      /* Mobile responsive */
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

  _handleEmployeeEdit(event) {
    const {employee} = event.detail;
    console.log('Edit employee:', employee);
    // TODO: Navigate to edit page or open edit dialog
  }

  _handleEmployeeDelete(event) {
    const {employee} = event.detail;
    console.log('Delete employee:', employee);
    // TODO: Show confirmation dialog and delete employee
  }

  render() {
    return html`
      <div class="page-header">
        <h1 class="page-title">${t('navigation.employees')}</h1>
        <div class="view-controls">
          <div class="view-toggle">
            <button
              class="view-button ${this.viewMode === 'table' ? 'active' : ''}"
              @click="${() => this._handleViewModeChange('table')}"
            >
              📊 Table
            </button>
            <button
              class="view-button ${this.viewMode === 'list' ? 'active' : ''}"
              @click="${() => this._handleViewModeChange('list')}"
            >
              📋 List
            </button>
          </div>
        </div>
      </div>

      <div class="content-area">
        ${this.loading
          ? html`
              <div class="loading-state">
                <div>Loading employees...</div>
              </div>
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
                @employee-edit="${this._handleEmployeeEdit}"
                @employee-delete="${this._handleEmployeeDelete}"
              ></employee-table>
            `
          : html`
              <div style="padding: 20px;">
                <p>List view coming soon...</p>
                <!-- TODO: Implement list view component -->
              </div>
            `}
      </div>
    `;
  }
}

customElements.define('list-employee-page', ListEmployeePage);
