import {
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  SET_EMPLOYEES,
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
} from '../actions/types.js';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

export const employeesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EMPLOYEES:
      return {
        ...state,
        list: action.payload,
      };

    case ADD_EMPLOYEE:
      return {
        ...state,
        list: [...state.list, action.payload],
        error: null,
      };

    case UPDATE_EMPLOYEE:
      return {
        ...state,
        list: state.list.map((employee) =>
          employee.id === action.payload.id
            ? {...employee, ...action.payload.updates}
            : employee
        ),
        error: null,
      };

    case DELETE_EMPLOYEE:
      return {
        ...state,
        list: state.list.filter(
          (employee) => employee.id !== action.payload.id
        ),
        error: null,
      };

    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
