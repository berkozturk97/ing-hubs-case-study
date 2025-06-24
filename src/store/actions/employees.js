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

  // Simulate API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        dispatch(addEmployee(employee));
        dispatch(setLoading(false));
        resolve();
      } catch (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
        reject(error);
      }
    }, 2000);
  });
};

export const updateEmployeeAsync = (id, updates) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  // Simulate API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        dispatch(updateEmployee(id, updates));
        dispatch(setLoading(false));
        resolve();
      } catch (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
        reject(error);
      }
    }, 2000);
  });
};

export const deleteEmployeeAsync = (id) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  // Simulate API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        dispatch(deleteEmployee(id));
        dispatch(setLoading(false));
        resolve();
      } catch (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
        reject(error);
      }
    }, 1000); // Shorter delay for delete operations
  });
};
