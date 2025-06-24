import {
  SET_VIEW_MODE,
  SET_CURRENT_ROUTE,
  SET_SEARCH_FILTER,
  SET_DEPARTMENT_FILTER,
  SET_POSITION_FILTER,
  CLEAR_FILTERS,
  SET_CURRENT_PAGE,
  SET_ITEMS_PER_PAGE,
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

export const setDepartmentFilter = (department) => ({
  type: SET_DEPARTMENT_FILTER,
  payload: department,
});

export const setPositionFilter = (position) => ({
  type: SET_POSITION_FILTER,
  payload: position,
});

export const clearFilters = () => ({
  type: CLEAR_FILTERS,
});

export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const setItemsPerPage = (itemsPerPage) => ({
  type: SET_ITEMS_PER_PAGE,
  payload: itemsPerPage,
});
