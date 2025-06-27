import {expect} from '@open-wc/testing';
import {employeesReducer} from '../../src/store/reducers/employees.js';
import {
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  SET_EMPLOYEES,
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
} from '../../src/store/actions/types.js';
import {sampleEmployees} from '../constants/sample.js';

suite('Employees Reducer', () => {
  const initialState = {
    list: [],
    loading: false,
    error: null,
  };

  test('should handle SET_EMPLOYEES', () => {
    const action = {
      type: SET_EMPLOYEES,
      payload: sampleEmployees,
    };

    const result = employeesReducer(initialState, action);

    expect(result.list).to.deep.equal(sampleEmployees);
    expect(result.loading).to.be.false;
    expect(result.error).to.be.null;
  });

  test('should handle ADD_EMPLOYEE', () => {
    const newEmployee = {
      id: '123',
      firstName: 'Berk',
      lastName: 'Ozturk',
      email: 'berk.ozturk@example.com',
    };

    const action = {
      type: ADD_EMPLOYEE,
      payload: newEmployee,
    };

    const result = employeesReducer(initialState, action);

    expect(result.list).to.have.lengthOf(1);
    expect(result.list[0]).to.deep.equal(newEmployee);
    expect(result.error).to.be.null;
  });

  test('should handle UPDATE_EMPLOYEE', () => {
    const currentState = {
      list: [sampleEmployees[0]],
      loading: false,
      error: null,
    };

    const updates = {
      firstName: 'Updated Name',
      updatedAt: '2023-06-15T10:30:00.000Z',
    };

    const action = {
      type: UPDATE_EMPLOYEE,
      payload: {
        id: sampleEmployees[0].id,
        updates,
      },
    };

    const result = employeesReducer(currentState, action);

    expect(result.list[0].firstName).to.equal('Updated Name');
    expect(result.list[0].lastName).to.equal(sampleEmployees[0].lastName);
    expect(result.error).to.be.null;
  });

  test('should handle DELETE_EMPLOYEE', () => {
    const currentState = {
      list: [sampleEmployees[0], sampleEmployees[1]],
      loading: false,
      error: null,
    };

    const action = {
      type: DELETE_EMPLOYEE,
      payload: {
        id: sampleEmployees[0].id,
      },
    };

    const result = employeesReducer(currentState, action);

    expect(result.list).to.have.lengthOf(1);
    expect(result.list[0]).to.deep.equal(sampleEmployees[1]);
    expect(result.error).to.be.null;
  });

  test('should handle SET_LOADING', () => {
    const action = {
      type: SET_LOADING,
      payload: true,
    };

    const result = employeesReducer(initialState, action);

    expect(result.loading).to.be.true;
    expect(result.list).to.deep.equal([]);
    expect(result.error).to.be.null;
  });

  test('should handle SET_ERROR', () => {
    const currentState = {
      list: sampleEmployees,
      loading: true,
      error: null,
    };

    const errorMessage = 'Something went wrong';
    const action = {
      type: SET_ERROR,
      payload: errorMessage,
    };

    const result = employeesReducer(currentState, action);

    expect(result.error).to.equal(errorMessage);
    expect(result.loading).to.be.false;
    expect(result.list).to.deep.equal(sampleEmployees);
  });

  test('should handle CLEAR_ERROR', () => {
    const currentState = {
      list: sampleEmployees,
      loading: true,
      error: 'Some error message',
    };

    const action = {
      type: CLEAR_ERROR,
    };

    const result = employeesReducer(currentState, action);

    expect(result.error).to.be.null;
    expect(result.loading).to.be.true;
    expect(result.list).to.deep.equal(sampleEmployees);
  });
});
