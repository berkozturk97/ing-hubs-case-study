import {
  SET_VIEW_MODE,
  SET_CURRENT_ROUTE,
  SET_SEARCH_FILTER,
  SET_CURRENT_PAGE,
  SET_ITEMS_PER_PAGE,
  SET_LANGUAGE,
} from '../actions/types.js';

const initialState = {
  viewMode: 'table', // 'list' or 'table'
  currentRoute: 'employees',
  language: 'en', // Default language
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

export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload,
      };

    case SET_CURRENT_ROUTE:
      return {
        ...state,
        currentRoute: action.payload,
      };

    case SET_SEARCH_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          search: action.payload,
        },
        pagination: {
          ...state.pagination,
          currentPage: 1, // Reset to first page when searching
        },
      };

    case SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          currentPage: action.payload,
        },
      };

    case SET_ITEMS_PER_PAGE:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          itemsPerPage: action.payload,
          currentPage: 1, // Reset to first page when changing items per page
        },
      };

    case SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };

    default:
      return state;
  }
};
