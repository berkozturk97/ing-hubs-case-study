import {expect} from '@open-wc/testing';
import sinon from 'sinon';
import {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setEmployees,
  setLoading,
  setError,
  clearError,
  addEmployeeAsync,
  updateEmployeeAsync,
  deleteEmployeeAsync,
} from '../../src/store/actions/employees.js';
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

suite('Employee Actions', () => {
  let clock;

  setup(() => {
    clock = sinon.useFakeTimers();
  });

  teardown(() => {
    clock.restore();
  });

  suite('Synchronous Action Creators', () => {
    suite('addEmployee', () => {
      test('should create an action to add an employee', () => {
        const action = addEmployee(sampleEmployees[0]);

        expect(action.type).to.equal(ADD_EMPLOYEE);
        expect(action.payload.firstName).to.equal(sampleEmployees[0].firstName);
        expect(action.payload.lastName).to.equal(sampleEmployees[0].lastName);
        expect(action.payload.email).to.equal(sampleEmployees[0].email);
        expect(action.payload.phone).to.equal(sampleEmployees[0].phone);
        expect(action.payload.dateOfBirth).to.equal(
          sampleEmployees[0].dateOfBirth
        );
        expect(action.payload.dateOfEmployment).to.equal(
          sampleEmployees[0].dateOfEmployment
        );
        expect(action.payload.department).to.equal(
          sampleEmployees[0].department
        );
        expect(action.payload.position).to.equal(sampleEmployees[0].position);
        expect(action.payload.id).to.be.a('string');
        expect(action.payload.createdAt).to.be.a('string');
        expect(action.payload.updatedAt).to.be.a('string');
      });
    });

    suite('updateEmployee', () => {
      test('should create an action to update an employee', () => {
        const id = sampleEmployees[0].id;
        const updates = {
          firstName: 'Berk',
          lastName: 'Ozturk',
          email: 'berk.ozturk@example.com',
        };

        const action = updateEmployee(id, updates);

        expect(action.type).to.equal(UPDATE_EMPLOYEE);
        expect(action.payload.id).to.equal(id);
        expect(action.payload.updates.firstName).to.equal('Berk');
        expect(action.payload.updates.lastName).to.equal('Ozturk');
        expect(action.payload.updates.email).to.equal(
          'berk.ozturk@example.com'
        );
        expect(action.payload.updates.updatedAt).to.be.a('string');
      });
    });

    suite('deleteEmployee', () => {
      test('should create an action to delete an employee', () => {
        const id = '12345';
        const action = deleteEmployee(id);

        expect(action.type).to.equal(DELETE_EMPLOYEE);
        expect(action.payload.id).to.equal(id);
      });
    });

    suite('setEmployees', () => {
      test('should create an action to set all employees', () => {
        const employees = [
          {id: '1', firstName: 'Berk', lastName: 'Ozturk'},
          {id: '2', firstName: 'Ahmet', lastName: 'Yilmaz'},
        ];

        const action = setEmployees(employees);

        expect(action.type).to.equal(SET_EMPLOYEES);
        expect(action.payload).to.deep.equal(employees);
      });

      test('should handle empty array', () => {
        const employees = [];
        const action = setEmployees(employees);

        expect(action.type).to.equal(SET_EMPLOYEES);
        expect(action.payload).to.deep.equal([]);
      });
    });

    suite('setLoading', () => {
      test('should create an action to set loading state to true', () => {
        const action = setLoading(true);

        expect(action.type).to.equal(SET_LOADING);
        expect(action.payload).to.be.true;
      });

      test('should create an action to set loading state to false', () => {
        const action = setLoading(false);

        expect(action.type).to.equal(SET_LOADING);
        expect(action.payload).to.be.false;
      });
    });

    suite('setError', () => {
      test('should create an action to set error message', () => {
        const errorMessage = 'Something went wrong';
        const action = setError(errorMessage);

        expect(action.type).to.equal(SET_ERROR);
        expect(action.payload).to.equal(errorMessage);
      });

      test('should handle error objects', () => {
        const error = new Error('Test error');
        const action = setError(error);

        expect(action.type).to.equal(SET_ERROR);
        expect(action.payload).to.equal(error);
      });
    });

    suite('clearError', () => {
      test('should create an action to clear error', () => {
        const action = clearError();

        expect(action.type).to.equal(CLEAR_ERROR);
        expect(action.payload).to.be.undefined;
      });
    });
  });

  suite('Asynchronous Action Creators (Thunks)', () => {
    let dispatch;

    setup(() => {
      dispatch = sinon.spy();
    });

    suite('addEmployeeAsync', () => {
      test('should dispatch loading and clear error actions, then add employee on success', async () => {
        const thunk = addEmployeeAsync(sampleEmployees[0]);
        const promise = thunk(dispatch);

        expect(dispatch.calledTwice).to.be.true;
        expect(dispatch.firstCall.args[0]).to.deep.equal(setLoading(true));
        expect(dispatch.secondCall.args[0]).to.deep.equal(clearError());

        clock.tick(2000);
        await promise;

        expect(dispatch.callCount).to.equal(4);
        expect(dispatch.thirdCall.args[0].type).to.equal(ADD_EMPLOYEE);
        expect(dispatch.thirdCall.args[0].payload.firstName).to.equal(
          sampleEmployees[0].firstName
        );
        expect(dispatch.getCall(3).args[0]).to.deep.equal(setLoading(false));
      });

      test('should handle errors and dispatch error actions', async () => {
        const employee = {firstName: 'Berk', lastName: 'Ozturk'};

        const originalDateNow = Date.now;
        Date.now = () => {
          throw new Error('Test error');
        };

        const thunk = addEmployeeAsync(employee);
        const promise = thunk(dispatch);

        clock.tick(2000);

        try {
          await promise;
          expect.fail('Promise should have rejected');
        } catch (error) {
          expect(error.message).to.equal('Test error');
          expect(dispatch.callCount).to.equal(4);
          expect(dispatch.thirdCall.args[0].type).to.equal(SET_ERROR);
          expect(dispatch.getCall(3).args[0]).to.deep.equal(setLoading(false));
        }
        Date.now = originalDateNow;
      });
    });

    suite('updateEmployeeAsync', () => {
      test('should dispatch loading and clear error actions, then update employee on success', async () => {
        const id = '12345';
        const updates = {firstName: 'UpdatedName'};

        const thunk = updateEmployeeAsync(id, updates);
        const promise = thunk(dispatch);

        expect(dispatch.firstCall.args[0]).to.deep.equal(setLoading(true));
        expect(dispatch.secondCall.args[0]).to.deep.equal(clearError());

        clock.tick(2000);
        await promise;

        expect(dispatch.thirdCall.args[0].type).to.equal(UPDATE_EMPLOYEE);
        expect(dispatch.thirdCall.args[0].payload.id).to.equal(id);
        expect(dispatch.thirdCall.args[0].payload.updates.firstName).to.equal(
          'UpdatedName'
        );
        expect(dispatch.getCall(3).args[0]).to.deep.equal(setLoading(false));
      });
    });

    suite('deleteEmployeeAsync', () => {
      test('should dispatch loading and clear error actions, then delete employee on success', async () => {
        const id = '12345';

        const thunk = deleteEmployeeAsync(id);
        const promise = thunk(dispatch);

        expect(dispatch.firstCall.args[0]).to.deep.equal(setLoading(true));
        expect(dispatch.secondCall.args[0]).to.deep.equal(clearError());

        clock.tick(1000);
        await promise;

        expect(dispatch.thirdCall.args[0].type).to.equal(DELETE_EMPLOYEE);
        expect(dispatch.thirdCall.args[0].payload.id).to.equal(id);
        expect(dispatch.getCall(3).args[0]).to.deep.equal(setLoading(false));
      });
    });
  });

  suite('Action Type Constants', () => {
    test('should export correct action type constants', () => {
      expect(ADD_EMPLOYEE).to.equal('ADD_EMPLOYEE');
      expect(UPDATE_EMPLOYEE).to.equal('UPDATE_EMPLOYEE');
      expect(DELETE_EMPLOYEE).to.equal('DELETE_EMPLOYEE');
      expect(SET_EMPLOYEES).to.equal('SET_EMPLOYEES');
      expect(SET_LOADING).to.equal('SET_LOADING');
      expect(SET_ERROR).to.equal('SET_ERROR');
      expect(CLEAR_ERROR).to.equal('CLEAR_ERROR');
    });
  });
});
