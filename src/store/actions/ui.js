import {
  SET_VIEW_MODE,
  SET_CURRENT_ROUTE,
  SET_SEARCH_FILTER,
  SET_CURRENT_PAGE,
  SET_ITEMS_PER_PAGE,
  SET_LANGUAGE,
} from './types.js';

export const setViewMode = (mode) => ({
  type: SET_VIEW_MODE,
  payload: mode,
});

export const setCurrentRoute = (route) => ({
  type: SET_CURRENT_ROUTE,
  payload: route,
});

export const setSearchFilter = (searchTerm) => ({
  type: SET_SEARCH_FILTER,
  payload: searchTerm,
});

export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const setItemsPerPage = (itemsPerPage) => ({
  type: SET_ITEMS_PER_PAGE,
  payload: itemsPerPage,
});

export const setLanguage = (language) => ({
  type: SET_LANGUAGE,
  payload: language,
});
