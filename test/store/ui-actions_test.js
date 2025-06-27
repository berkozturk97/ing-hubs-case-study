import {expect} from '@open-wc/testing';
import {
  setViewMode,
  setCurrentRoute,
  setSearchFilter,
  setCurrentPage,
  setItemsPerPage,
  setLanguage,
} from '../../src/store/actions/ui.js';
import {
  SET_VIEW_MODE,
  SET_CURRENT_ROUTE,
  SET_SEARCH_FILTER,
  SET_CURRENT_PAGE,
  SET_ITEMS_PER_PAGE,
  SET_LANGUAGE,
} from '../../src/store/actions/types.js';

suite('UI Actions', () => {
  test('should create setViewMode action', () => {
    const mode = 'list';
    const action = setViewMode(mode);

    expect(action.type).to.equal(SET_VIEW_MODE);
    expect(action.payload).to.equal(mode);
  });

  test('should create setCurrentRoute action', () => {
    const route = '/employees/create';
    const action = setCurrentRoute(route);

    expect(action.type).to.equal(SET_CURRENT_ROUTE);
    expect(action.payload).to.equal(route);
  });

  test('should create setSearchFilter action', () => {
    const searchTerm = 'John Doe';
    const action = setSearchFilter(searchTerm);

    expect(action.type).to.equal(SET_SEARCH_FILTER);
    expect(action.payload).to.equal(searchTerm);
  });

  test('should create setCurrentPage action', () => {
    const page = 3;
    const action = setCurrentPage(page);

    expect(action.type).to.equal(SET_CURRENT_PAGE);
    expect(action.payload).to.equal(page);
  });

  test('should create setItemsPerPage action', () => {
    const itemsPerPage = 25;
    const action = setItemsPerPage(itemsPerPage);

    expect(action.type).to.equal(SET_ITEMS_PER_PAGE);
    expect(action.payload).to.equal(itemsPerPage);
  });

  test('should create setLanguage action', () => {
    const language = 'tr';
    const action = setLanguage(language);

    expect(action.type).to.equal(SET_LANGUAGE);
    expect(action.payload).to.equal(language);
  });
});
