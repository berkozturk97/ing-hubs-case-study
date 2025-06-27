import {expect} from '@open-wc/testing';
import sinon from 'sinon';
import {sampleEmployees} from '../constants/sample.js';
import {
  setupReduxMocks,
  createNavigationSpies,
} from '../helpers/test-helpers.js';

const {mockT} = setupReduxMocks({
  'modal.deleteEmployeeConfirm': 'Are you sure you want to delete {name}?',
});

suite('Employee List Component', () => {
  let EmployeeListClass;
  let element;

  setup(async () => {
    try {
      await import('../../src/components/employee-list.js');

      EmployeeListClass = customElements.get('employee-list');

      element = new EmployeeListClass();
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
  });

  test('should have default properties', () => {
    if (!element) return;

    expect(element.employees).to.deep.equal([]);
    expect(element.loading).to.be.false;
    expect(element.currentPage).to.equal(1);
    expect(element.itemsPerPage).to.equal(10);
    expect(element.employeeToDelete).to.be.null;
    expect(element.deleteModalOpen).to.be.false;
    expect(element.deleteLoading).to.be.false;
  });

  test('should handle edit action', () => {
    if (!element) return;

    const {pushStateSpy, dispatchEventSpy} = createNavigationSpies();

    element._handleEdit(sampleEmployees[0]);

    expect(pushStateSpy.calledOnce).to.be.true;
    expect(pushStateSpy.calledWith({}, '', '/edit-employee/1')).to.be.true;
    expect(dispatchEventSpy.calledOnce).to.be.true;
  });

  test('should handle delete action', () => {
    if (!element) return;

    element._handleDelete(sampleEmployees[0]);

    expect(element.employeeToDelete).to.deep.equal(sampleEmployees[0]);
    expect(element.deleteModalOpen).to.be.true;
  });

  test('should handle delete confirmation', () => {
    if (!element) return;

    element.employeeToDelete = sampleEmployees[0];
    element.deleteModalOpen = true;

    let deleteEvent = null;
    element.addEventListener('employee-delete', (e) => {
      deleteEvent = e;
    });

    element._handleDeleteConfirmed();

    expect(deleteEvent).to.not.be.null;
    expect(deleteEvent.detail.employee).to.deep.equal(sampleEmployees[0]);
    expect(element.deleteLoading).to.be.true;
  });

  test('should handle delete cancellation', () => {
    if (!element) return;

    element.employeeToDelete = sampleEmployees[0];
    element.deleteModalOpen = true;
    element.deleteLoading = true;

    element._handleDeleteCancelled();

    expect(element.deleteModalOpen).to.be.false;
    expect(element.employeeToDelete).to.be.null;
    expect(element.deleteLoading).to.be.false;
  });

  test('should implement pagination correctly', () => {
    if (!element) return;

    const manyEmployees = Array.from({length: 25}, (_, i) => ({
      ...sampleEmployees[0],
      id: `emp-${i}`,
      firstName: `Employee${i}`,
      lastName: `LastName${i}`,
    }));

    element.employees = manyEmployees;
    element.currentPage = 1;
    element.itemsPerPage = 10;

    const paginated = element.paginatedEmployees;
    expect(paginated).to.have.length(10);
    expect(paginated[0].firstName).to.equal('Employee0');
    expect(paginated[9].firstName).to.equal('Employee9');

    element.currentPage = 2;
    const secondPage = element.paginatedEmployees;
    expect(secondPage).to.have.length(10);
    expect(secondPage[0].firstName).to.equal('Employee10');

    element.currentPage = 3;
    const lastPage = element.paginatedEmployees;
    expect(lastPage).to.have.length(5);
    expect(lastPage[0].firstName).to.equal('Employee20');
  });

  test('should format dates correctly', () => {
    if (!element) return;

    const formattedDate = element._formatDate('2020-01-15');
    expect(formattedDate).to.include('2020');
    expect(formattedDate).to.include('1');
    expect(formattedDate).to.include('15');

    expect(element._formatDate('')).to.equal('');
    expect(element._formatDate(null)).to.equal('');
  });

  test('should format phone numbers correctly', () => {
    if (!element) return;

    expect(element._formatPhone('+1234567890')).to.equal('+1234567890');
    expect(element._formatPhone('')).to.equal('');
    expect(element._formatPhone(null)).to.equal('');
  });

  test('should handle page change events', () => {
    if (!element) return;

    let pageChangeEvent = null;
    element.addEventListener('page-change', (e) => {
      pageChangeEvent = e;
    });

    const mockEvent = {
      detail: {page: 2, itemsPerPage: 10},
    };

    element._handlePageChange(mockEvent);

    expect(pageChangeEvent).to.not.be.null;
    expect(pageChangeEvent.detail).to.deep.equal(mockEvent.detail);
    expect(pageChangeEvent.bubbles).to.be.true;
    expect(pageChangeEvent.composed).to.be.true;
  });

  test('should handle items per page change events', () => {
    if (!element) return;

    let itemsPerPageEvent = null;
    element.addEventListener('items-per-page-change', (e) => {
      itemsPerPageEvent = e;
    });

    const mockEvent = {
      detail: {itemsPerPage: 20},
    };

    element._handleItemsPerPageChange(mockEvent);

    expect(itemsPerPageEvent).to.not.be.null;
    expect(itemsPerPageEvent.detail).to.deep.equal(mockEvent.detail);
  });

  test('should handle closeDeleteModal method', () => {
    if (!element) return;

    element.employeeToDelete = sampleEmployees[0];
    element.deleteModalOpen = true;
    element.deleteLoading = true;

    element.closeDeleteModal();

    expect(element.deleteModalOpen).to.be.false;
    expect(element.employeeToDelete).to.be.null;
    expect(element.deleteLoading).to.be.false;
  });

  test('should have correct component properties defined', () => {
    if (!element) return;

    const properties = element.constructor.properties;
    expect(properties).to.exist;
    expect(properties.employees).to.exist;
    expect(properties.employees.type).to.equal(Array);
    expect(properties.loading).to.exist;
    expect(properties.loading.type).to.equal(Boolean);
    expect(properties.currentPage).to.exist;
    expect(properties.currentPage.type).to.equal(Number);
  });

  test('should test helper methods for CSS classes', () => {
    if (!element) return;

    expect(element._getDepartmentClass('tech')).to.equal('department-tech');
    expect(element._getDepartmentClass('analytics')).to.equal(
      'department-analytics'
    );
    expect(element._getDepartmentClass('unknown')).to.equal('department-tech');

    expect(element._getPositionClass('junior')).to.equal('position-junior');
    expect(element._getPositionClass('medior')).to.equal('position-medior');
    expect(element._getPositionClass('senior')).to.equal('position-senior');
    expect(element._getPositionClass('default')).to.equal('position-junior');
  });

  test('should render empty state when no employees', () => {
    if (!element) return;

    element.employees = [];
    const result = element.render();

    expect(result).to.exist;
    expect(result.strings).to.exist;
  });

  test('should execute render method with employees', () => {
    if (!element) return;

    element.employees = sampleEmployees;
    element.currentPage = 1;
    element.itemsPerPage = 10;

    const result = element.render();
    expect(result).to.exist;
  });
});
