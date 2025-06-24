/* eslint-disable no-undef */

import {
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  SET_EMPLOYEES,
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
} from './types.js';

export const addEmployee = (employee) => ({
  type: ADD_EMPLOYEE,
  payload: {
    ...employee,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
});

export const updateEmployee = (id, updates) => ({
  type: UPDATE_EMPLOYEE,
  payload: {
    id,
    updates: {
      ...updates,
      updatedAt: new Date().toISOString(),
    },
  },
});

export const deleteEmployee = (id) => ({
  type: DELETE_EMPLOYEE,
  payload: {id},
});

export const setEmployees = (employees) => ({
  type: SET_EMPLOYEES,
  payload: employees,
});

// UI Action Creators
export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});

export const addEmployeeAsync = (employee) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  try {
    if (!employee.firstName || !employee.lastName || !employee.email) {
      throw new Error('First name, last name, and email are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employee.email)) {
      throw new Error('Please enter a valid email address');
    }

    dispatch(addEmployee(employee));
    dispatch(setLoading(false));
    return Promise.resolve();
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
    return Promise.reject(error);
  }
};

export const updateEmployeeAsync = (id, updates) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  try {
    dispatch(updateEmployee(id, updates));
    dispatch(setLoading(false));
    return Promise.resolve();
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
    return Promise.reject(error);
  }
};

export const deleteEmployeeAsync = (id) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  try {
    dispatch(deleteEmployee(id));
    dispatch(setLoading(false));
    return Promise.resolve();
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
    return Promise.reject(error);
  }
};
