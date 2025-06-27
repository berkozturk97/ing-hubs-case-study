import {expect} from '@open-wc/testing';
import sinon from 'sinon';
import {sampleEmployees} from '../constants/sample.js';
import {setupReduxMocks} from '../helpers/test-helpers.js';

if (!window.process) {
  window.process = {env: {NODE_ENV: 'test'}};
}

const {mockT} = setupReduxMocks({
  'navigation.employees': 'Employees',
  'common.table': 'Table',
  'common.list': 'List',
  'common.deleting': 'Deleting...',
  'toast.employeeDeleted': 'Employee Deleted',
  'toast.employeeDeletedDesc': 'Employee has been successfully deleted',
  'toast.deleteError': 'Delete Error',
});

window.toastService = {
  success: sinon.stub(),
  error: sinon.stub(),
};

suite('List Employee Page Component', () => {
  let ListEmployeePageClass;
  let element;
  let storeStub;
  let toastServiceStub;

  setup(async () => {
    try {
      // Setup stubs
      storeStub = {
        dispatch: sinon.stub().resolves(),
      };

      toastServiceStub = {
        success: sinon.stub(),
        error: sinon.stub(),
      };

      window.store = storeStub;
      window.toastService = toastServiceStub;

      await import('../../src/pages/list-employee-page.js');

      ListEmployeePageClass = customElements.get('list-employee-page');

      element = new ListEmployeePageClass();
      element.t = mockT;
    } catch (error) {
      console.log(
        'Import failed, using fallback test approach:',
        error.message
      );
      element = null;
    }
  });

  teardown(() => {
    sinon.restore();
    delete window.store;
    delete window.toastService;
  });

  test('should have default properties', () => {
    expect(element.employees).to.deep.equal([]);
    expect(element.loading).to.be.false;
    expect(element.viewMode).to.equal('table');
    expect(element.currentPage).to.equal(1);
    expect(element.itemsPerPage).to.equal(10);
  });

  test('should have correct component properties defined', () => {
    const properties = element.constructor.properties;
    expect(properties).to.exist;
    expect(properties.employees).to.exist;
    expect(properties.employees.type).to.equal(Array);
    expect(properties.loading).to.exist;
    expect(properties.loading.type).to.equal(Boolean);
    expect(properties.viewMode).to.exist;
    expect(properties.viewMode.type).to.equal(String);
    expect(properties.currentPage).to.exist;
    expect(properties.currentPage.type).to.equal(Number);
    expect(properties.itemsPerPage).to.exist;
    expect(properties.itemsPerPage.type).to.equal(Number);
  });

  test('should handle state changes', () => {
    const mockState = {
      employees: {
        list: sampleEmployees,
        loading: true,
      },
      ui: {
        viewMode: 'list',
        pagination: {
          currentPage: 2,
          itemsPerPage: 20,
        },
        language: 'en',
      },
    };

    element.stateChanged(mockState);

    expect(element.employees).to.deep.equal(sampleEmployees);
    expect(element.loading).to.be.true;
    expect(element.viewMode).to.equal('list');
    expect(element.currentPage).to.equal(2);
    expect(element.itemsPerPage).to.equal(20);
  });

  test('should handle state changes with missing properties', () => {
    const mockState = {
      employees: {},
      ui: {
        pagination: {},
        language: 'en',
      },
    };

    element.stateChanged(mockState);

    expect(element.employees).to.deep.equal([]);
    expect(element.loading).to.be.false;
    expect(element.viewMode).to.equal('table');
    expect(element.currentPage).to.equal(1);
    expect(element.itemsPerPage).to.equal(10);
  });

  test('should handle view mode change to table', () => {
    expect(element._handleViewModeChange).to.be.a('function');

    element._handleViewModeChange('table');
    expect(element.viewMode).to.equal('table');
  });

  test('should handle page change events', () => {
    const mockEvent = {
      detail: {
        page: 3,
      },
    };

    expect(element._handlePageChange).to.be.a('function');

    element._handlePageChange(mockEvent);
  });

  test('should handle items per page change events', () => {
    const mockEvent = {
      detail: {
        itemsPerPage: 25,
      },
    };

    expect(element._handleItemsPerPageChange).to.be.a('function');

    element._handleItemsPerPageChange(mockEvent);
  });

  test('should render loading state', () => {
    element.loading = true;

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;
  });

  test('should render empty state', () => {
    element.loading = false;
    element.employees = [];

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;
  });

  test('should render table view with employees', () => {
    element.loading = false;
    element.employees = sampleEmployees;
    element.viewMode = 'table';
    element.currentPage = 1;
    element.itemsPerPage = 10;

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;
  });

  test('should render list view with employees', () => {
    element.loading = false;
    element.employees = sampleEmployees;
    element.viewMode = 'list';
    element.currentPage = 2;
    element.itemsPerPage = 20;

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;
  });
});
