import sinon from 'sinon';

/**
 * Creates a mock modal object with common modal methods
 * @param {Object} options - Configuration for the mock modal
 * @returns {Object} Mock modal with stubbed methods
 */
export function createMockModal(options = {}) {
  return {
    openModal: sinon.stub(),
    closeModal: sinon.stub(),
    ...options,
  };
}

/**
 * Mocks the shadowRoot property on an element with querySelector
 * @param {Object} element - The element to mock shadowRoot on
 * @param {Object} modal - The modal object to return from querySelector
 * @returns {Object} The querySelector stub for additional assertions
 */
export function mockShadowRoot(element, modal) {
  const querySelectorStub = sinon.stub().returns(modal);

  Object.defineProperty(element, 'shadowRoot', {
    value: {querySelector: querySelectorStub},
    configurable: true,
  });

  return querySelectorStub;
}

/**
 * Creates standard window history and dispatch event spies
 * @returns {Object} Object containing pushState and dispatchEvent spies
 */
export function createNavigationSpies() {
  return {
    pushStateSpy: sinon.stub(window.history, 'pushState'),
    dispatchEventSpy: sinon.stub(window, 'dispatchEvent'),
  };
}

/**
 * Creates a mock connect mixin for Redux components
 * @returns {Function} Mock connect function
 */
export function createMockConnect() {
  return () => (superClass) =>
    class extends superClass {
      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) {
          super.disconnectedCallback();
        }
      }

      stateChanged() {}
    };
}

/**
 * Creates a mock localization function with common translations
 * @param {Object} additionalTranslations - Additional translations to merge
 * @returns {Function} Mock translation function
 */
export function createMockT(additionalTranslations = {}) {
  const baseTranslations = {
    'common.noEmployees': 'No Employees Found',
    'common.addFirstEmployee': 'Add your first employee to get started',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.in': 'in',
    'common.actions': 'Actions',
    'common.cancel': 'Cancel',
    'employee.email': 'Email',
    'employee.phone': 'Phone',
    'employee.dateOfEmployment': 'Employment Date',
    'employee.dateOfBirth': 'Date of Birth',
    'employeeForm.firstName': 'First Name',
    'employeeForm.lastName': 'Last Name',
    'employeeForm.dateOfEmployment': 'Date of Employment',
    'employeeForm.dateOfBirth': 'Date of Birth',
    'employeeForm.phoneNumber': 'Phone Number',
    'employeeForm.emailAddress': 'Email Address',
    'employeeForm.department': 'Department',
    'employeeForm.position': 'Position',
    'departments.tech': 'Technology',
    'departments.analytics': 'Analytics',
    'positions.junior': 'Junior',
    'positions.medior': 'Medior',
    'positions.senior': 'Senior',
    'modal.confirmDelete': 'Confirm Delete',
    'modal.deleteEmployeeConfirm':
      'Are you sure you want to delete this employee?',
    'deleteModal.title': 'Confirm Delete',
    'deleteModal.message': 'Are you sure you want to delete this employee?',
    'deleteModal.warning': 'This action cannot be undone.',
    'deleteModal.confirmButton': 'Delete',
    'deleteModal.cancelButton': 'Cancel',
    'pagination.showing': 'Showing {start}-{end} of {total}',
    'pagination.prev': 'Previous',
    'pagination.next': 'Next',
    'pagination.show': 'Show',
    'pagination.perPage': 'per page',
    ...additionalTranslations,
  };

  return (key, params = {}) => {
    let translation = baseTranslations[key] || key;

    // Simple parameter replacement
    if (params) {
      Object.keys(params).forEach((param) => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }

    return translation;
  };
}

/**
 * Sets up common Redux and localization mocks
 * @param {Object} additionalTranslations - Additional translations
 * @returns {Object} Object containing mockT and other setup utilities
 */
export function setupReduxMocks(additionalTranslations = {}) {
  // Setup process environment
  window.process = {env: {NODE_ENV: 'test'}};

  // Setup connect mixin
  const connect = createMockConnect();
  window.connectMixin = {connect};

  // Setup localization
  const mockT = createMockT(additionalTranslations);
  const mockGetCurrentLanguage = () => 'en';

  window.ReduxLocalizationMock = {
    t: mockT,
    getCurrentLanguage: mockGetCurrentLanguage,
  };

  return {
    mockT,
    mockGetCurrentLanguage,
    connect,
  };
}

/**
 * Creates a test event listener helper
 * @param {Object} element - Element to add listener to
 * @param {string} eventType - Type of event to listen for
 * @returns {Object} Object with the captured event and assertion helpers
 */
export function createEventCapture(element, eventType) {
  let capturedEvent = null;

  element.addEventListener(eventType, (e) => {
    capturedEvent = e;
  });

  return {
    get event() {
      return capturedEvent;
    },
    expectEvent() {
      if (!capturedEvent) {
        throw new Error(`Expected ${eventType} event was not fired`);
      }
      return capturedEvent;
    },
  };
}

/**
 * Validates cross-browser error messages for null reference errors
 * @param {Error} error - The error to check
 * @returns {boolean} Whether the error is an expected null reference error
 */
export function isExpectedNullError(error) {
  const errorMessage = error.message;
  return (
    errorMessage.includes('Cannot read properties of null') || // Chrome
    errorMessage.includes('this.shadowRoot is null') || // Firefox/Webkit
    errorMessage.includes('null is not an object') // Safari
  );
}
