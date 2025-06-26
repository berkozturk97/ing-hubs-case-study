import {LitElement, html, css} from 'lit';
import {ReduxLocalizedMixin} from '../localization/redux-localized-mixin.js';

export class Pagination extends ReduxLocalizedMixin(LitElement) {
  static get properties() {
    return {
      currentPage: {type: Number},
      totalItems: {type: Number},
      itemsPerPage: {type: Number},
      maxVisiblePages: {type: Number},
    };
  }

  constructor() {
    super();
    this.currentPage = 1;
    this.totalItems = 0;
    this.itemsPerPage = 10;
    this.maxVisiblePages = 5;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
      }

      .pagination-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 8px;
        gap: 16px;
        flex-wrap: wrap;
      }

      .pagination-info {
        font-size: 14px;
        color: #666;
        white-space: nowrap;
      }

      .pagination-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .pagination-button {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 36px;
        height: 36px;
        border: 1px solid #e0e0e0;
        background: white;
        color: #666;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        text-decoration: none;
        user-select: none;
      }

      .pagination-button:hover:not(:disabled) {
        background-color: #f5f5f5;
        border-color: #ccc;
      }

      .pagination-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #f9f9f9;
      }

      .pagination-button.active {
        background-color: #ff6200;
        color: white;
        border-color: #ff6200;
      }

      .pagination-button.active:hover {
        background-color: #ff6200;
        border-color: #ff6200;
      }

      .pagination-ellipsis {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 36px;
        height: 36px;
        color: #999;
        font-size: 14px;
        user-select: none;
      }

      .items-per-page {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #666;
      }

      .items-per-page select {
        padding: 6px 8px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        background: white;
        font-size: 14px;
        cursor: pointer;
      }

      .items-per-page select:focus {
        outline: none;
        border-color: #ff6200;
        box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.2);
      }

      @media (max-width: 768px) {
        .pagination-container {
          flex-direction: column;
          gap: 12px;
        }

        .pagination-info {
          order: 3;
        }

        .pagination-controls {
          order: 1;
          flex-wrap: wrap;
          justify-content: center;
        }

        .items-per-page {
          order: 2;
        }

        .pagination-button {
          min-width: 32px;
          height: 32px;
          font-size: 13px;
        }
      }

      @media (max-width: 480px) {
        .pagination-controls {
          gap: 4px;
        }

        .pagination-button {
          min-width: 28px;
          height: 28px;
          font-size: 12px;
        }
      }
    `;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get startItem() {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem() {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.totalItems);
  }

  _getVisiblePages() {
    const totalPages = this.totalPages;
    const current = this.currentPage;
    const maxVisible = this.maxVisiblePages;

    if (totalPages <= maxVisible) {
      return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({length: end - start + 1}, (_, i) => start + i);
  }

  _handlePageChange(page) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.dispatchEvent(
        new CustomEvent('page-change', {
          detail: {page},
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  _handleItemsPerPageChange(event) {
    const itemsPerPage = parseInt(event.target.value);
    this.dispatchEvent(
      new CustomEvent('items-per-page-change', {
        detail: {itemsPerPage},
        bubbles: true,
        composed: true,
      })
    );
  }

  _renderPageButton(page, label = null) {
    const isActive = page === this.currentPage;
    const displayLabel = label || page;

    return html`
      <button
        class="pagination-button ${isActive ? 'active' : ''}"
        @click="${() => this._handlePageChange(page)}"
      >
        ${displayLabel}
      </button>
    `;
  }

  render() {
    if (this.totalItems === 0) {
      return html``;
    }

    const visiblePages = this._getVisiblePages();
    const totalPages = this.totalPages;
    const showFirstEllipsis = visiblePages[0] > 2;
    const showLastEllipsis =
      visiblePages[visiblePages.length - 1] < totalPages - 1;

    return html`
      <div class="pagination-container">
        <div class="pagination-info">
          ${this.t('pagination.showing', {
            start: this.startItem,
            end: this.endItem,
            total: this.totalItems,
          })}
        </div>

        <div class="pagination-controls">
          <button
            class="pagination-button"
            @click="${() => this._handlePageChange(this.currentPage - 1)}"
            ?disabled="${this.currentPage === 1}"
          >
            ← ${this.t('pagination.prev')}
          </button>

          ${visiblePages[0] > 1 ? this._renderPageButton(1) : ''}
          ${showFirstEllipsis
            ? html`<span class="pagination-ellipsis">...</span>`
            : ''}
          ${visiblePages.map((page) => this._renderPageButton(page))}
          ${showLastEllipsis
            ? html`<span class="pagination-ellipsis">...</span>`
            : ''}
          ${visiblePages[visiblePages.length - 1] < totalPages
            ? this._renderPageButton(totalPages)
            : ''}

          <button
            class="pagination-button"
            @click="${() => this._handlePageChange(this.currentPage + 1)}"
            ?disabled="${this.currentPage === totalPages}"
          >
            ${this.t('pagination.next')} →
          </button>
        </div>

        <div class="items-per-page">
          <label for="items-per-page">${this.t('pagination.show')}:</label>
          <select
            id="items-per-page"
            .value="${this.itemsPerPage}"
            @change="${this._handleItemsPerPageChange}"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>${this.t('pagination.perPage')}</span>
        </div>
      </div>
    `;
  }
}

customElements.define('app-pagination', Pagination);
