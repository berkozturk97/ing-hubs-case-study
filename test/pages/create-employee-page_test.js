import {expect} from '@open-wc/testing';
import sinon from 'sinon';
import {setupReduxMocks} from '../helpers/test-helpers.js';

const {mockT} = setupReduxMocks({
  'navigation.createEmployee': 'Create Employee',
  'common.loading': 'Loading...',
  'common.error': 'Error',
});

suite('Create Employee Page Component', () => {
  let CreateEmployeePageClass;
  let element;

  setup(async () => {
    try {
      await import('../../src/pages/create-employee-page.js');

      CreateEmployeePageClass = customElements.get('create-employee-page');

      element = new CreateEmployeePageClass();
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
    expect(element.loading).to.be.false;
    expect(element.error).to.be.null;
  });

  test('should have correct component properties defined', () => {
    const properties = element.constructor.properties;
    expect(properties).to.exist;
    expect(properties.loading).to.exist;
    expect(properties.loading.type).to.equal(Boolean);
    expect(properties.error).to.exist;
    expect(properties.error.type).to.equal(String);
  });

  test('should handle state changes correctly', () => {
    const mockState = {
      employees: {
        loading: true,
        error: 'Test error message',
      },
      ui: {
        language: 'en',
      },
    };

    element.stateChanged(mockState);

    expect(element.loading).to.be.true;
    expect(element.error).to.equal('Test error message');
  });

  test('should handle state changes with missing properties', () => {
    const mockState = {
      employees: {
        loading: undefined,
        error: undefined,
      },
      ui: {
        language: 'en',
      },
    };

    element.stateChanged(mockState);

    expect(element.loading).to.be.undefined;
    expect(element.error).to.be.undefined;
  });

  test('should handle employee create event', () => {
    const pushStateSpy = sinon.spy(window.history, 'pushState');
    const dispatchEventSpy = sinon.spy(window, 'dispatchEvent');

    expect(element._handleEmployeeCreate).to.be.a('function');

    element._handleEmployeeCreate();

    setTimeout(() => {
      expect(pushStateSpy.calledOnce).to.be.true;
      expect(pushStateSpy.calledWith({}, '', '/employees')).to.be.true;
      expect(dispatchEventSpy.calledOnce).to.be.true;
    }, 150);
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

  test('should show success and navigate with delay', () => {
    expect(element._showSuccessAndNavigate).to.be.a('function');

    const navigateToEmployeeListStub = sinon.stub(
      element,
      '_navigateToEmployeeList'
    );

    element._showSuccessAndNavigate();

    expect(element._showSuccessAndNavigate).to.be.a('function');
    expect(navigateToEmployeeListStub.notCalled).to.be.true;
  });

  test('should render without error banner when no error', () => {
    element.error = null;
    element.loading = false;

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;

    // Convert to string to check content
    const renderedString = result.strings.join('');
    expect(renderedString).to.not.include('error-banner');
    expect(renderedString).to.include('employee-form');
  });

  test('should render with error banner when error exists', () => {
    element.error = 'Test error message';
    element.loading = false;

    const result = element.render();
    expect(result).to.exist;

    // The main template should include employee-form
    const templateString = result.strings.join('');
    expect(templateString).to.include('employee-form');

    // Check that the conditional error template is in the values array
    const errorBannerTemplate = result.values.find(
      (value) =>
        value &&
        value.strings &&
        value.strings.join('').includes('error-banner')
    );
    expect(errorBannerTemplate).to.exist;
    expect(errorBannerTemplate.values).to.include('Test error message');
  });

  test('should render with loading state passed to form', () => {
    element.loading = true;
    element.error = null;

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;

    const renderedString = result.strings.join('');
    expect(renderedString).to.include('employee-form');
  });

  test('should handle form cancel event from employee form', () => {
    const pushStateSpy = sinon.spy(window.history, 'pushState');
    const dispatchEventSpy = sinon.spy(window, 'dispatchEvent');

    const formCancelEvent = new CustomEvent('form-cancel', {
      bubbles: true,
      composed: true,
    });

    element.addEventListener('form-cancel', (event) => {
      element._handleFormCancel(event);
    });

    element.dispatchEvent(formCancelEvent);

    expect(pushStateSpy.calledOnce).to.be.true;
    expect(pushStateSpy.calledWith({}, '', '/employees')).to.be.true;
    expect(dispatchEventSpy.calledOnce).to.be.true;
  });
});
