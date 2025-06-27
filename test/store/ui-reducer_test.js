import {expect} from '@open-wc/testing';
import {uiReducer} from '../../src/store/reducers/ui.js';
import {
  SET_VIEW_MODE,
  SET_CURRENT_ROUTE,
  SET_SEARCH_FILTER,
  SET_CURRENT_PAGE,
  SET_ITEMS_PER_PAGE,
  SET_LANGUAGE,
} from '../../src/store/actions/types.js';

suite('UI Reducer', () => {
  const initialState = {
    viewMode: 'table',
    currentRoute: 'employees',
    language: 'en',
    filters: {
      search: '',
      department: '',
      position: '',
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
    },
  };

  test('should handle SET_VIEW_MODE', () => {
    const action = {
      type: SET_VIEW_MODE,
      payload: 'list',
    };

    const result = uiReducer(initialState, action);

    expect(result.viewMode).to.equal('list');
    expect(result.currentRoute).to.equal('employees');
    expect(result.language).to.equal('en');
  });

  test('should handle SET_CURRENT_ROUTE', () => {
    const action = {
      type: SET_CURRENT_ROUTE,
      payload: '/employees/create',
    };

    const result = uiReducer(initialState, action);

    expect(result.currentRoute).to.equal('/employees/create');
    expect(result.viewMode).to.equal('table');
    expect(result.language).to.equal('en');
  });

  test('should handle SET_SEARCH_FILTER', () => {
    const currentState = {
      ...initialState,
      pagination: {
        currentPage: 3,
        itemsPerPage: 10,
      },
    };

    const action = {
      type: SET_SEARCH_FILTER,
      payload: 'Berk',
    };

    const result = uiReducer(currentState, action);

    expect(result.filters.search).to.equal('Berk');
    expect(result.pagination.currentPage).to.equal(1); // Should reset to page 1
    expect(result.pagination.itemsPerPage).to.equal(10);
  });

  test('should handle SET_CURRENT_PAGE', () => {
    const action = {
      type: SET_CURRENT_PAGE,
      payload: 5,
    };

    const result = uiReducer(initialState, action);

    expect(result.pagination.currentPage).to.equal(5);
    expect(result.pagination.itemsPerPage).to.equal(10);
    expect(result.viewMode).to.equal('table');
  });

  test('should handle SET_ITEMS_PER_PAGE', () => {
    const currentState = {
      ...initialState,
      pagination: {
        currentPage: 3,
        itemsPerPage: 10,
      },
    };

    const action = {
      type: SET_ITEMS_PER_PAGE,
      payload: 25,
    };

    const result = uiReducer(currentState, action);

    expect(result.pagination.itemsPerPage).to.equal(25);
    expect(result.pagination.currentPage).to.equal(1); // Should reset to page 1
    expect(result.viewMode).to.equal('table');
  });

  test('should handle SET_LANGUAGE', () => {
    const action = {
      type: SET_LANGUAGE,
      payload: 'tr',
    };

    const result = uiReducer(initialState, action);

    expect(result.language).to.equal('tr');
    expect(result.viewMode).to.equal('table');
    expect(result.currentRoute).to.equal('employees');
  });
});
