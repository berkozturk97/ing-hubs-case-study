import {expect} from '@open-wc/testing';
import sinon from 'sinon';
import {
  localStorageMiddleware,
  loadStateFromLocalStorage,
} from '../../src/store/middleware/localStorage.js';

suite('LocalStorage Middleware', () => {
  let localStorageStub;
  let consoleWarnStub;
  let mockStore;
  let mockNext;

  setup(() => {
    localStorageStub = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageStub,
      writable: true,
    });

    consoleWarnStub = sinon.stub(console, 'warn');

    mockStore = {
      getState: sinon.stub().returns({
        employees: {list: [], loading: false, error: null},
        ui: {viewMode: 'table'},
      }),
    };

    mockNext = sinon.stub().returns('action-result');
  });

  teardown(() => {
    sinon.restore();
  });

  test('should save state to localStorage after action', () => {
    const middleware = localStorageMiddleware(mockStore);
    const dispatch = middleware(mockNext);
    const action = {type: 'TEST_ACTION'};

    const result = dispatch(action);

    expect(mockNext.calledWith(action)).to.be.true;
    expect(mockStore.getState.calledOnce).to.be.true;
    expect(localStorageStub.setItem.calledOnce).to.be.true;

    const [key, value] = localStorageStub.setItem.firstCall.args;
    expect(key).to.equal('employeeApp');

    const parsedValue = JSON.parse(value);
    expect(parsedValue).to.have.property('employees');
    expect(parsedValue.employees).to.deep.equal({
      list: [],
      loading: false,
      error: null,
    });

    expect(result).to.equal('action-result');
  });

  test('should handle localStorage setItem error', () => {
    localStorageStub.setItem.throws(new Error('Storage quota exceeded'));

    const middleware = localStorageMiddleware(mockStore);
    const dispatch = middleware(mockNext);
    const action = {type: 'TEST_ACTION'};

    const result = dispatch(action);

    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleWarnStub.firstCall.args[0]).to.include(
      'Failed to save state to localStorage'
    );
    expect(result).to.equal('action-result');
  });

  test('should load state from localStorage successfully', () => {
    const savedState = {
      employees: {list: [{id: '1', name: 'John'}], loading: false, error: null},
    };
    localStorageStub.getItem.returns(JSON.stringify(savedState));

    const result = loadStateFromLocalStorage();

    expect(localStorageStub.getItem.calledWith('employeeApp')).to.be.true;
    expect(result).to.deep.equal(savedState);
  });

  test('should return undefined when no saved state exists', () => {
    localStorageStub.getItem.returns(null);

    const result = loadStateFromLocalStorage();

    expect(localStorageStub.getItem.calledWith('employeeApp')).to.be.true;
    expect(result).to.be.undefined;
  });

  test('should handle localStorage getItem error', () => {
    localStorageStub.getItem.throws(new Error('localStorage not available'));

    const result = loadStateFromLocalStorage();

    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleWarnStub.firstCall.args[0]).to.include(
      'Failed to load state from localStorage'
    );
    expect(result).to.be.undefined;
  });

  test('should handle JSON parse error', () => {
    localStorageStub.getItem.returns('invalid-json');

    const result = loadStateFromLocalStorage();

    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleWarnStub.firstCall.args[0]).to.include(
      'Failed to load state from localStorage'
    );
    expect(result).to.be.undefined;
  });

  test('should only persist employees state', () => {
    mockStore.getState.returns({
      employees: {list: [{id: '1'}], loading: true, error: 'test'},
      ui: {viewMode: 'list', currentRoute: '/test'},
      otherData: {sensitive: 'data'},
    });

    const middleware = localStorageMiddleware(mockStore);
    const dispatch = middleware(mockNext);
    const action = {type: 'TEST_ACTION'};

    dispatch(action);

    const [, value] = localStorageStub.setItem.firstCall.args;
    const parsedValue = JSON.parse(value);

    expect(parsedValue).to.have.property('employees');
    expect(parsedValue).to.not.have.property('ui');
    expect(parsedValue).to.not.have.property('otherData');
    expect(parsedValue.employees).to.deep.equal({
      list: [{id: '1'}],
      loading: true,
      error: 'test',
    });
  });
});
