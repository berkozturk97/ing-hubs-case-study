import {
  SET_VIEW_MODE,
  SET_CURRENT_ROUTE,
  SET_SEARCH_FILTER,
  SET_DEPARTMENT_FILTER,
  SET_POSITION_FILTER,
  CLEAR_FILTERS,
  SET_CURRENT_PAGE,
  SET_ITEMS_PER_PAGE,
} from '../actions/types.js';

const initialState = {
  viewMode: 'list', // 'list' or 'table'
  currentRoute: 'employees',
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

    case SET_DEPARTMENT_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          department: action.payload,
        },
        pagination: {
          ...state.pagination,
          currentPage: 1, // Reset to first page when filtering
        },
      };

    case SET_POSITION_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          position: action.payload,
        },
        pagination: {
          ...state.pagination,
          currentPage: 1, // Reset to first page when filtering
        },
      };

    case CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          search: '',
          department: '',
          position: '',
        },
        pagination: {
          ...state.pagination,
          currentPage: 1,
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

    default:
      return state;
  }
};
