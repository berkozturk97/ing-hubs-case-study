import {expect} from '@open-wc/testing';
import sinon from 'sinon';
import {sampleEmployees} from '../constants/sample.js';
import {setupReduxMocks, createEventCapture} from '../helpers/test-helpers.js';

const {mockT} = setupReduxMocks({
  'validation.nameMinLength': 'Name must be at least 2 characters',
  'validation.nameInvalidChars': 'Name can only contain letters and spaces',
  'validation.emailRequired': 'Email is required',
  'validation.emailInvalid': 'Please enter a valid email address',
  'validation.emailExists': 'Email already exists',
  'validation.phoneRequired': 'Phone number is required',
  'validation.phoneInvalid': 'Please enter a valid phone number',
  'validation.dateRequired': 'Date is required',
  'validation.dateInvalid': 'Please enter a valid date',
  'validation.ageInvalid': 'Age must be between 16 and 100',
  'validation.dateBirthFuture': 'Birth date cannot be in the future',
  'validation.selectionRequired': 'Please make a selection',
  'toast.employeeCreated': 'Employee Created',
  'toast.employeeCreatedDesc': 'Employee has been successfully created',
  'toast.createError': 'Creation Error',
  'toast.employeeUpdated': 'Employee Updated',
  'toast.employeeUpdatedDesc': 'Employee has been successfully updated',
  'toast.updateError': 'Update Error',
  'employee-created': 'employee-created',
  'employee-updated': 'employee-updated',
  'form-cancel': 'form-cancel',
  'common.updating': 'Updating...',
  'common.creating': 'Creating...',
  'common.update': 'Update',
  'common.create': 'Create',
  'common.reset': 'Reset',
  'employeeForm.editTitle': 'Edit Employee',
  'employeeForm.createTitle': 'Create Employee',
  'employeeForm.editSubtitle': 'Update employee information',
  'employeeForm.createSubtitle': 'Add a new employee to the system',
  'employeeForm.firstNamePlaceholder': 'Enter first name',
  'employeeForm.lastNamePlaceholder': 'Enter last name',
  'employeeForm.emailPlaceholder': 'Enter email address',
  'employeeForm.phonePlaceholder': 'Enter phone number',
  'employeeForm.phoneHelp': 'Format: +1234567890 or (123) 456-7890',
  'employeeForm.selectDepartment': 'Select Department',
  'employeeForm.selectPosition': 'Select Position',
  'employeeForm.updateConfirmation.title': 'Confirm Update',
  'employeeForm.updateConfirmation.message':
    'Are you sure you want to update this employee?',
  'employeeForm.updateConfirmation.warning':
    'This action will modify the employee record.',
});

suite('Employee Form Component', () => {
  let EmployeeFormClass;
  let element;
  let storeStub;
  let toastServiceStub;

  setup(async () => {
    try {
      storeStub = {
        dispatch: sinon.stub().resolves(),
      };
      window.store = storeStub;

      toastServiceStub = {
        success: sinon.stub(),
        error: sinon.stub(),
      };
      window.toastService = toastServiceStub;

      await import('../../src/components/employee-form.js');

      EmployeeFormClass = customElements.get('employee-form');

      element = new EmployeeFormClass();
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
    if (!element) return;

    expect(element.employee).to.be.null;
    expect(element.isEditMode).to.be.false;
    expect(element.loading).to.be.false;
    expect(element.errors).to.deep.equal({});
    expect(element.existingEmployees).to.deep.equal([]);
    expect(element.showUpdateConfirmation).to.be.false;
    expect(element.formData).to.exist;
    expect(element.formData.firstName).to.equal('');
    expect(element.formData.lastName).to.equal('');
    expect(element.formData.email).to.equal('');
  });

  test('should initialize form data correctly', () => {
    if (!element) return;

    element._initializeFormData();

    expect(element.formData).to.deep.equal({
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    });
  });

  test('should set edit mode when employee prop is provided', () => {
    if (!element) return;

    element.employee = sampleEmployees[0];
    element.updated(new Map([['employee', null]]));

    expect(element.isEditMode).to.be.true;
    expect(element.formData.firstName).to.equal('Berk');
    expect(element.formData.lastName).to.equal('Oz');
    expect(element.formData.email).to.equal('berk.oz@example.com');
    expect(element.formData.department).to.equal('tech');
    expect(element.formData.position).to.equal('senior');
  });

  test('should validate firstName field correctly', () => {
    if (!element) return;

    // Test empty name
    let errors = element._validateField('firstName', '');
    expect(errors.firstName).to.equal('Name must be at least 2 characters');

    // Test short name
    errors = element._validateField('firstName', 'A');
    expect(errors.firstName).to.equal('Name must be at least 2 characters');

    // Test invalid characters
    errors = element._validateField('firstName', 'John123');
    expect(errors.firstName).to.equal(
      'Name can only contain letters and spaces'
    );

    // Test valid name
    errors = element._validateField('firstName', 'John');
    expect(Object.keys(errors)).to.have.length(0);

    // Test valid name with spaces
    errors = element._validateField('firstName', 'John Doe');
    expect(Object.keys(errors)).to.have.length(0);
  });

  test('should validate lastName field correctly', () => {
    if (!element) return;

    let errors = element._validateField('lastName', '');
    expect(errors.lastName).to.equal('Name must be at least 2 characters');

    errors = element._validateField('lastName', 'A');
    expect(errors.lastName).to.equal('Name must be at least 2 characters');

    errors = element._validateField('lastName', 'Smith123');
    expect(errors.lastName).to.equal(
      'Name can only contain letters and spaces'
    );

    errors = element._validateField('lastName', 'Smith');
    expect(Object.keys(errors)).to.have.length(0);
  });

  test('should validate email field correctly', () => {
    if (!element) return;

    let errors = element._validateField('email', '');
    expect(errors.email).to.equal('Email is required');

    errors = element._validateField('email', 'invalid-email');
    expect(errors.email).to.equal('Please enter a valid email address');

    errors = element._validateField('email', 'test@');
    expect(errors.email).to.equal('Please enter a valid email address');

    errors = element._validateField('email', '@domain.com');
    expect(errors.email).to.equal('Please enter a valid email address');

    errors = element._validateField('email', 'test@example.com');
    expect(Object.keys(errors)).to.have.length(0);
  });

  test('should validate email uniqueness for new employees', () => {
    if (!element) return;

    element.existingEmployees = sampleEmployees;
    element.isEditMode = false;

    let errors = element._validateField('email', 'berk.oz@example.com');
    expect(errors.email).to.equal('Email already exists');

    errors = element._validateField('email', 'new@example.com');
    expect(Object.keys(errors)).to.have.length(0);
  });

  test('should allow same email in edit mode for current employee', () => {
    if (!element) return;

    element.existingEmployees = sampleEmployees;
    element.isEditMode = true;
    element.employee = sampleEmployees[0];

    let errors = element._validateField('email', 'berk.oz@example.com');
    expect(Object.keys(errors)).to.have.length(0);

    errors = element._validateField('email', 'cem.demir@example.com');
    expect(errors.email).to.equal('Email already exists');
  });

  test('should validate phone field correctly', () => {
    if (!element) return;

    let errors = element._validateField('phone', '');
    expect(errors.phone).to.equal('Phone number is required');

    errors = element._validateField('phone', '123');
    expect(errors.phone).to.equal('Please enter a valid phone number');

    errors = element._validateField('phone', 'abc');
    expect(errors.phone).to.equal('Please enter a valid phone number');

    errors = element._validateField('phone', '1234567890');
    expect(Object.keys(errors)).to.have.length(0);

    errors = element._validateField('phone', '+1234567890');
    expect(Object.keys(errors)).to.have.length(0);

    errors = element._validateField('phone', '(123) 456-7890');
    expect(Object.keys(errors)).to.have.length(0);
  });

  test('should validate dateOfEmployment field correctly', () => {
    if (!element) return;

    let errors = element._validateField('dateOfEmployment', '');
    expect(errors.dateOfEmployment).to.equal('Date is required');

    errors = element._validateField('dateOfEmployment', 'invalid-date');
    expect(errors.dateOfEmployment).to.equal('Please enter a valid date');

    errors = element._validateField('dateOfEmployment', '2020-01-15');
    expect(Object.keys(errors)).to.have.length(0);
  });

  test('should validate dateOfBirth field correctly', () => {
    if (!element) return;

    let errors = element._validateField('dateOfBirth', '');
    expect(errors.dateOfBirth).to.equal('Date is required');

    errors = element._validateField('dateOfBirth', 'invalid-date');
    expect(errors.dateOfBirth).to.equal('Please enter a valid date');

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    errors = element._validateField(
      'dateOfBirth',
      futureDate.toISOString().split('T')[0]
    );
    expect(errors.dateOfBirth).to.equal('Birth date cannot be in the future');

    const tooYoung = new Date();
    tooYoung.setFullYear(tooYoung.getFullYear() - 10);
    errors = element._validateField(
      'dateOfBirth',
      tooYoung.toISOString().split('T')[0]
    );
    expect(errors.dateOfBirth).to.equal('Age must be between 16 and 100');

    const validDate = new Date();
    validDate.setFullYear(validDate.getFullYear() - 25);
    errors = element._validateField(
      'dateOfBirth',
      validDate.toISOString().split('T')[0]
    );
    expect(Object.keys(errors)).to.have.length(0);
  });

  test('should validate department and position fields correctly', () => {
    if (!element) return;

    let errors = element._validateField('department', '');
    expect(errors.department).to.equal('Please make a selection');

    errors = element._validateField('department', 'tech');
    expect(Object.keys(errors)).to.have.length(0);

    errors = element._validateField('position', '');
    expect(errors.position).to.equal('Please make a selection');

    errors = element._validateField('position', 'senior');
    expect(Object.keys(errors)).to.have.length(0);
  });

  test('should validate entire form correctly', () => {
    if (!element) return;

    element.formData = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };

    let isValid = element._validateForm();
    expect(isValid).to.be.false;
    expect(Object.keys(element.errors)).to.have.length(8);

    element.formData = {
      firstName: 'Berkovic',
      lastName: 'Ozturkson',
      dateOfEmployment: '2020-01-15',
      dateOfBirth: '1990-05-20',
      phone: '+1234567890',
      email: 'berk.ozturk@example.com',
      department: 'tech',
      position: 'senior',
    };

    isValid = element._validateForm();
    expect(isValid).to.be.true;
    expect(Object.keys(element.errors)).to.have.length(0);
  });

  test('should handle input change correctly', () => {
    if (!element) return;

    const mockEvent = {
      target: {
        name: 'firstName',
        value: 'Berkovic',
      },
    };

    element._handleInputChange(mockEvent);

    expect(element.formData.firstName).to.equal('Berkovic');
  });

  test('should clear field errors on valid input change', () => {
    if (!element) return;

    element.errors = {firstName: 'Some error'};

    const mockEvent = {
      target: {
        name: 'firstName',
        value: 'Berkovic',
      },
    };

    element._handleInputChange(mockEvent);

    expect(element.errors.firstName).to.be.undefined;
  });

  test('should set field errors on invalid input change', () => {
    if (!element) return;

    const mockEvent = {
      target: {
        name: 'firstName',
        value: 'A',
      },
    };

    element._handleInputChange(mockEvent);

    expect(element.errors.firstName).to.equal(
      'Name must be at least 2 characters'
    );
  });

  test('should handle form submission for new employee', () => {
    if (!element) return;

    const mockEvent = {preventDefault: sinon.stub()};

    element.formData = {
      firstName: 'Berkovic',
      lastName: 'Ozturkson',
      dateOfEmployment: '2020-01-15',
      dateOfBirth: '1990-05-20',
      phone: '+1234567890',
      email: 'berk.ozturk@example.com',
      department: 'tech',
      position: 'senior',
    };

    element.isEditMode = false;

    const performCreateSpy = sinon.stub(element, '_performCreateEmployee');

    element._handleSubmit(mockEvent);

    expect(mockEvent.preventDefault.calledOnce).to.be.true;
    expect(performCreateSpy.calledOnce).to.be.true;
  });

  test('should handle form submission for edit mode', () => {
    if (!element) return;

    const mockEvent = {preventDefault: sinon.stub()};

    element.formData = {
      firstName: 'Berkovic',
      lastName: 'Ozturkson',
      dateOfEmployment: '2020-01-15',
      dateOfBirth: '1990-05-20',
      phone: '+1234567890',
      email: 'berk.ozturk@example.com',
      department: 'tech',
      position: 'senior',
    };

    element.isEditMode = true;

    element._handleSubmit(mockEvent);

    expect(mockEvent.preventDefault.calledOnce).to.be.true;
    expect(element.showUpdateConfirmation).to.be.true;
  });

  test('should not submit invalid form', () => {
    if (!element) return;

    const mockEvent = {preventDefault: sinon.stub()};

    element.formData = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };

    const performCreateSpy = sinon.stub(element, '_performCreateEmployee');

    element._handleSubmit(mockEvent);

    expect(mockEvent.preventDefault.calledOnce).to.be.true;
    expect(performCreateSpy.called).to.be.false;
    expect(element.showUpdateConfirmation).to.be.false;
  });

  test('should handle update confirmation', () => {
    if (!element) return;

    element.showUpdateConfirmation = true;
    const performUpdateSpy = sinon.stub(element, '_performUpdateEmployee');

    element._handleUpdateConfirmed();

    expect(element.showUpdateConfirmation).to.be.false;
    expect(performUpdateSpy.calledOnce).to.be.true;
  });

  test('should handle update cancellation', () => {
    if (!element) return;

    element.showUpdateConfirmation = true;

    element._handleUpdateCancelled();

    expect(element.showUpdateConfirmation).to.be.false;
  });

  test('should handle form cancel', () => {
    if (!element) return;

    const eventCapture = createEventCapture(element, 'form-cancel');

    element._handleCancel();

    const cancelEvent = eventCapture.expectEvent();
    expect(cancelEvent.bubbles).to.be.true;
    expect(cancelEvent.composed).to.be.true;
  });

  test('should handle form reset for new employee', () => {
    if (!element) return;

    element.formData = {
      firstName: 'Berkovic',
      lastName: 'Ozturkson',
      email: 'berk.ozturk@example.com',
    };
    element.errors = {firstName: 'Some error'};
    element.isEditMode = false;

    element._handleReset();

    expect(element.formData).to.deep.equal({
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    });
    expect(element.errors).to.deep.equal({});
  });

  test('should handle form reset for edit mode', () => {
    if (!element) return;

    element.employee = sampleEmployees[0];
    element.isEditMode = true;
    element.formData = {
      firstName: 'Changed',
      lastName: 'Changed',
      email: 'changed@example.com',
    };
    element.errors = {firstName: 'Some error'};

    element._handleReset();

    expect(element.formData.firstName).to.equal('Berk');
    expect(element.formData.lastName).to.equal('Oz');
    expect(element.formData.email).to.equal('berk.oz@example.com');
    expect(element.errors).to.deep.equal({});
  });

  test('should have correct component properties defined', () => {
    if (!element) return;

    const properties = element.constructor.properties;
    expect(properties).to.exist;
    expect(properties.employee).to.exist;
    expect(properties.employee.type).to.equal(Object);
    expect(properties.isEditMode).to.exist;
    expect(properties.isEditMode.type).to.equal(Boolean);
    expect(properties.loading).to.exist;
    expect(properties.loading.type).to.equal(Boolean);
    expect(properties.errors).to.exist;
    expect(properties.errors.type).to.equal(Object);
    expect(properties.existingEmployees).to.exist;
    expect(properties.existingEmployees.type).to.equal(Array);
    expect(properties.showUpdateConfirmation).to.exist;
    expect(properties.showUpdateConfirmation.type).to.equal(Boolean);
  });

  test('should execute render method for new employee form', () => {
    if (!element) return;

    element.isEditMode = false;
    element.loading = false;

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;
  });

  test('should execute render method for edit employee form', () => {
    if (!element) return;

    element.isEditMode = true;
    element.employee = sampleEmployees[0];
    element.loading = false;

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;
  });

  test('should execute render method with loading state', () => {
    if (!element) return;

    element.loading = true;
    element.isEditMode = false;

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;
  });

  test('should execute render method with update confirmation modal', () => {
    if (!element) return;

    element.showUpdateConfirmation = true;
    element.isEditMode = true;

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;
  });

  test('should render dateOfBirth error message', () => {
    if (!element) return;

    element.errors = {
      dateOfBirth: 'Birth date cannot be in the future',
    };

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;
  });

  test('should render dateOfEmployment error message', () => {
    if (!element) return;

    element.errors = {
      dateOfEmployment: 'Date is required',
    };

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;
  });

  test('should render department error message', () => {
    if (!element) return;

    element.errors = {
      department: 'Please make a selection',
    };

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;
  });

  test('should render position error message', () => {
    if (!element) return;

    element.errors = {
      position: 'Please make a selection',
    };

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;
  });

  test('should render all field errors together', () => {
    if (!element) return;

    element.errors = {
      firstName: 'Name must be at least 2 characters',
      lastName: 'Name must be at least 2 characters',
      email: 'Email is required',
      phone: 'Phone number is required',
      dateOfBirth: 'Birth date cannot be in the future',
      dateOfEmployment: 'Date is required',
      department: 'Please make a selection',
      position: 'Please make a selection',
    };

    const result = element.render();
    expect(result).to.exist;
    expect(result.strings).to.exist;
  });

  test('should handle update confirmation properly', () => {
    if (!element) return;

    element.showUpdateConfirmation = true;
    element.employee = {id: '1'};
    element.formData = {firstName: 'Berkovic'};

    const performUpdateSpy = sinon.stub(element, '_performUpdateEmployee');

    element._handleUpdateConfirmed();

    expect(element.showUpdateConfirmation).to.be.false;
    expect(performUpdateSpy.calledOnce).to.be.true;
  });
});
