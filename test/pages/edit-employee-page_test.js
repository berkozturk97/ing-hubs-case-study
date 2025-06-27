import {expect} from '@open-wc/testing';
import sinon from 'sinon';
import {sampleEmployees} from '../constants/sample.js';
import {setupReduxMocks} from '../helpers/test-helpers.js';

const {mockT} = setupReduxMocks({
  'navigation.editEmployee': 'Edit Employee',
  'common.loading': 'Loading...',
  'common.error': 'Error',
});

suite('Edit Employee Page Component', () => {
  let EditEmployeePageClass;
  let element;

  setup(async () => {
    try {
      await import('../../src/pages/edit-employee-page.js');

      EditEmployeePageClass = customElements.get('edit-employee-page');

      element = new EditEmployeePageClass();
      element.t = mockT;
    } catch (error) {
      console.log(error.message);
      element = null;
    }
  });

  teardown(() => {
    sinon.restore();
  });

  test('should have default properties', () => {
    expect(element.employeeId).to.be.null;
    expect(element.employee).to.be.null;
    expect(element.loading).to.be.false;
    expect(element.error).to.be.null;
  });

  test('should have correct component properties defined', () => {
    const properties = element.constructor.properties;
    expect(properties).to.exist;
    expect(properties.employeeId).to.exist;
    expect(properties.employeeId.type).to.equal(String);
    expect(properties.employee).to.exist;
    expect(properties.employee.type).to.equal(Object);
    expect(properties.loading).to.exist;
    expect(properties.loading.type).to.equal(Boolean);
    expect(properties.error).to.exist;
    expect(properties.error.type).to.equal(String);
  });

  test('should handle state changes correctly with employee found', () => {
    element.employeeId = '1';

    const mockState = {
      employees: {
        list: sampleEmployees,
        loading: false,
        error: null,
      },
      ui: {
        language: 'en',
      },
    };

    element.stateChanged(mockState);

    expect(element.loading).to.be.false;
    expect(element.error).to.be.null;
    expect(element.employee).to.deep.equal(sampleEmployees[0]);
  });

  test('should handle state changes with employee not found', () => {
    element.employeeId = 'non-existent-id';

    const mockState = {
      employees: {
        list: sampleEmployees,
        loading: false,
        error: null,
      },
      ui: {
        language: 'en',
      },
    };

    element.stateChanged(mockState);

    expect(element.loading).to.be.false;
    expect(element.error).to.equal('Employee not found');
    expect(element.employee).to.be.null;
  });

  test('should handle onBeforeEnter lifecycle', () => {
    const mockLocation = {
      params: {
        id: 'test-employee-id',
      },
    };

    const result = element.onBeforeEnter(mockLocation);

    expect(result).to.be.true;
    expect(element.employeeId).to.equal('test-employee-id');
  });

  test('should handle employee update event', () => {
    expect(element._handleEmployeeUpdate).to.be.a('function');

    element._handleEmployeeUpdate();

    expect(element._handleEmployeeUpdate).to.be.a('function');
  });

  test('should handle form cancel event', () => {
    const pushStateSpy = sinon.spy(window.history, 'pushState');
    const dispatchEventSpy = sinon.spy(window, 'dispatchEvent');

    expect(element._handleFormCancel).to.be.a('function');

    element._handleFormCancel();

    expect(pushStateSpy.calledOnce).to.be.true;
    expect(pushStateSpy.calledWith({}, '', '/employees')).to.be.true;
    expect(dispatchEventSpy.calledOnce).to.be.true;
  });

  test('should navigate to employee list', () => {
    const pushStateSpy = sinon.spy(window.history, 'pushState');
    const dispatchEventSpy = sinon.spy(window, 'dispatchEvent');

    expect(element._navigateToEmployeeList).to.be.a('function');

    element._navigateToEmployeeList();

    expect(pushStateSpy.calledOnce).to.be.true;
    expect(pushStateSpy.calledWith({}, '', '/employees')).to.be.true;
    expect(dispatchEventSpy.calledOnce).to.be.true;

    const event = dispatchEventSpy.firstCall.args[0];
    expect(event).to.be.instanceOf(PopStateEvent);
    expect(event.type).to.equal('popstate');
  });

  test('should show success and navigate with delay', () => {
    const navigateToEmployeeListStub = sinon.stub(
      element,
      '_navigateToEmployeeList'
    );

    expect(element._showSuccessAndNavigate).to.be.a('function');

    element._showSuccessAndNavigate();

    expect(navigateToEmployeeListStub.notCalled).to.be.true;
  });

  test('should render edit form when employee exists', () => {
    element.employee = sampleEmployees[0];
    element.error = null;
    element.loading = false;

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;

    const renderedString = result.strings.join('');
    expect(renderedString).to.include('Edit Employee');
    expect(renderedString).to.include('employee-form');
    expect(renderedString).to.include('back-button');
    expect(renderedString).to.not.include('error-banner');

    expect(result.values).to.include(sampleEmployees[0].firstName);
    expect(result.values).to.include(sampleEmployees[0].lastName);
  });

  test('should render with loading state passed to form', () => {
    element.employee = sampleEmployees[0];
    element.loading = true;
    element.error = null;

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;

    const renderedString = result.strings.join('');
    expect(renderedString).to.include('employee-form');
    expect(renderedString).to.include('Edit Employee');
  });

  test('should handle back button click', () => {
    const pushStateSpy = sinon.spy(window.history, 'pushState');
    const dispatchEventSpy = sinon.spy(window, 'dispatchEvent');

    element._navigateBack();

    expect(pushStateSpy.calledOnce).to.be.true;
    expect(pushStateSpy.calledWith({}, '', '/employees')).to.be.true;
    expect(dispatchEventSpy.calledOnce).to.be.true;
  });

  test('should handle custom events from employee form', () => {
    const navigateToEmployeeListStub = sinon.stub(
      element,
      '_navigateToEmployeeList'
    );

    const employeeUpdatedEvent = new CustomEvent('employee-updated', {
      bubbles: true,
      composed: true,
      detail: {employee: sampleEmployees[0]},
    });

    element.addEventListener('employee-updated', (event) => {
      element._handleEmployeeUpdate(event);
    });

    element.dispatchEvent(employeeUpdatedEvent);

    expect(navigateToEmployeeListStub.notCalled).to.be.true;
  });

  test('should extract employee ID from connectedCallback', () => {
    const extractSpy = sinon.spy(element, '_extractEmployeeIdFromLocation');

    element.connectedCallback();

    expect(extractSpy.calledOnce).to.be.true;
  });
});
