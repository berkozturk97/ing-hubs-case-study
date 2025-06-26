import {LitElement, html, css} from 'lit';
import {store} from '../store/index.js';
import {
  addEmployeeAsync,
  updateEmployeeAsync,
} from '../store/actions/employees.js';
import {toastService} from '../utils/toast-service.js';
import './custom-button.js';
import './loading-spinner.js';
import './confirmation-modal.js';
import {ReduxLocalizedMixin} from '../localization/redux-localized-mixin.js';

export class EmployeeForm extends ReduxLocalizedMixin(LitElement) {
  static get properties() {
    return {
      employee: {type: Object},
      isEditMode: {type: Boolean},
      errors: {type: Object},
      existingEmployees: {type: Array},
      loading: {type: Boolean},
      showUpdateConfirmation: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.employee = null;
    this.isEditMode = false;
    this.loading = false;
    this.errors = {};
    this.existingEmployees = [];
    this.showUpdateConfirmation = false;
    this._initializeFormData();
  }

  stateChanged(state) {
    super.stateChanged(state);

    this.existingEmployees = state.employees.list || [];
    this.loading = state.employees.loading;
  }

  _initializeFormData() {
    this.formData = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };
  }

  updated(changedProperties) {
    if (changedProperties.has('employee') && this.employee) {
      this.isEditMode = true;
      this.formData = {
        firstName: this.employee.firstName || '',
        lastName: this.employee.lastName || '',
        dateOfEmployment: this.employee.dateOfEmployment || '',
        dateOfBirth: this.employee.dateOfBirth || '',
        phone: this.employee.phone || '',
        email: this.employee.email || '',
        department: this.employee.department || '',
        position: this.employee.position || '',
      };
      this.requestUpdate();
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
      }

      .form-container {
        background: white;
        border-radius: 8px;
        padding: 32px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin: 0 auto;
      }

      .form-header {
        text-align: center;
        margin-bottom: 32px;
      }

      .form-title {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px 0;
      }

      .form-subtitle {
        font-size: 14px;
        color: #666;
        margin: 0;
      }

      .form-grid {
        display: grid;
        gap: 20px;
        margin-bottom: 32px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-group.full-width {
        grid-column: 1 / -1;
      }

      .form-label {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }

      .form-label.required::after {
        content: '*';
        color: #d32f2f;
        margin-left: 4px;
      }

      .form-input,
      .form-select {
        padding: 12px 16px;
        border: 2px solid #e0e0e0;
        border-radius: 6px;
        font-size: 14px;
        font-family: inherit;
        transition: all 0.2s ease;
        background: white;
      }

      .form-input:focus,
      .form-select:focus {
        outline: none;
        border-color: #ff6200;
        box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
      }

      .form-input.error,
      .form-select.error {
        border-color: #d32f2f;
        box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
      }

      .form-select {
        cursor: pointer;
      }

      .form-select option {
        padding: 8px;
      }

      .error-message {
        font-size: 12px;
        color: #d32f2f;
        margin-top: 4px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .form-actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        padding-top: 24px;
        border-top: 1px solid #f0f0f0;
      }

      .help-text {
        font-size: 12px;
        color: #666;
        margin-top: 4px;
      }

      .form-group.valid .form-input,
      .form-group.valid .form-select {
        border-color: #4caf50;
      }

      .form-group.valid::after {
        content: '✓';
        color: #4caf50;
        font-weight: bold;
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
      }

      .form-group {
        position: relative;
      }

      @media (max-width: 768px) {
        .form-container {
          padding: 24px 20px;
          margin: 0 16px;
        }

        .form-row {
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .form-actions {
          flex-direction: column-reverse;
        }

        .form-title {
          font-size: 20px;
        }
      }

      @media (max-width: 480px) {
        .form-container {
          padding: 20px 16px;
          margin: 0 8px;
        }

        .form-actions {
          gap: 12px;
        }
      }
    `;
  }

  _validateField(field, value) {
    const errors = {};

    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!value || value.trim().length < 2) {
          errors[field] = this.t('validation.nameMinLength');
        } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) {
          errors[field] = this.t('validation.nameInvalidChars');
        }
        break;

      case 'email':
        if (!value || !value.trim()) {
          errors[field] = this.t('validation.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          errors[field] = this.t('validation.emailInvalid');
        } else {
          const emailExists = this.existingEmployees.some((emp) => {
            if (
              this.isEditMode &&
              this.employee &&
              emp.id === this.employee.id
            ) {
              return false;
            }
            return (
              emp.email &&
              emp.email.toLowerCase() === value.trim().toLowerCase()
            );
          });

          if (emailExists) {
            errors[field] = this.t('validation.emailExists');
          }
        }
        break;

      case 'phone':
        if (!value || !value.trim()) {
          errors[field] = this.t('validation.phoneRequired');
        } else if (!/^\+?[\d\s\-()]{10,}$/.test(value.trim())) {
          errors[field] = this.t('validation.phoneInvalid');
        }
        break;

      case 'dateOfEmployment':
        if (!value) {
          errors[field] = this.t('validation.dateRequired');
        } else {
          const date = new Date(value);

          if (isNaN(date.getTime())) {
            errors[field] = this.t('validation.dateInvalid');
          }
        }
        break;

      case 'dateOfBirth':
        if (!value) {
          errors[field] = this.t('validation.dateRequired');
        } else {
          const date = new Date(value);
          const today = new Date();

          if (isNaN(date.getTime())) {
            errors[field] = this.t('validation.dateInvalid');
          } else {
            const age = today.getFullYear() - date.getFullYear();
            if (age < 16 || age > 100) {
              errors[field] = this.t('validation.ageInvalid');
            }
            if (date > today) {
              errors[field] = this.t('validation.dateBirthFuture');
            }
          }
        }
        break;

      case 'department':
      case 'position':
        if (!value || !value.trim()) {
          errors[field] = this.t('validation.selectionRequired');
        }
        break;
    }

    return errors;
  }

  _validateForm() {
    let allErrors = {};

    Object.keys(this.formData).forEach((field) => {
      const fieldErrors = this._validateField(field, this.formData[field]);
      allErrors = {...allErrors, ...fieldErrors};
    });

    this.errors = allErrors;
    return Object.keys(allErrors).length === 0;
  }

  _handleInputChange(event) {
    const {name, value} = event.target;
    this.formData = {...this.formData, [name]: value};

    if (this.errors[name]) {
      const newErrors = {...this.errors};
      delete newErrors[name];
      this.errors = newErrors;
    }

    const fieldErrors = this._validateField(name, value);
    if (Object.keys(fieldErrors).length > 0) {
      this.errors = {...this.errors, ...fieldErrors};
    }

    this.requestUpdate();
  }

  _handleSubmit(event) {
    event.preventDefault();
    if (!this._validateForm()) {
      this.requestUpdate();
      return;
    }

    if (this.isEditMode) {
      this.showUpdateConfirmation = true;
    } else {
      this._performCreateEmployee();
    }
  }

  _performCreateEmployee() {
    const eventData = {...this.formData};

    store
      .dispatch(addEmployeeAsync(this.formData))
      .then(() => {
        toastService.success(
          this.t('toast.employeeCreated'),
          4000,
          this.t('toast.employeeCreatedDesc')
        );

        this.dispatchEvent(
          new CustomEvent(this.t('employee-created'), {
            detail: {employee: eventData},
            bubbles: true,
            composed: true,
          })
        );
      })
      .catch((error) => {
        console.error('Creation failed:', error);
        toastService.error(
          this.t('toast.createError'),
          6000,
          error.message || 'An unexpected error occurred'
        );
      });
  }

  _performUpdateEmployee() {
    const eventData = {...this.formData, id: this.employee.id};

    store
      .dispatch(updateEmployeeAsync(this.employee.id, this.formData))
      .then(() => {
        toastService.success(
          this.t('toast.employeeUpdated'),
          4000,
          this.t('toast.employeeUpdatedDesc')
        );

        this.dispatchEvent(
          new CustomEvent(this.t('employee-updated'), {
            detail: {employee: eventData},
            bubbles: true,
            composed: true,
          })
        );
      })
      .catch((error) => {
        console.error('Update failed:', error);
        toastService.error(
          this.t('toast.updateError'),
          6000,
          error.message || 'An unexpected error occurred'
        );
      });
  }

  _handleUpdateConfirmed() {
    this.showUpdateConfirmation = false;
    this._performUpdateEmployee();
  }

  _handleUpdateCancelled() {
    this.showUpdateConfirmation = false;
  }

  _handleCancel() {
    this.dispatchEvent(
      new CustomEvent(this.t('form-cancel'), {
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleReset() {
    this._initializeFormData();
    this.errors = {};
    if (this.employee && this.isEditMode) {
      this.formData = {
        firstName: this.employee.firstName || '',
        lastName: this.employee.lastName || '',
        dateOfEmployment: this.employee.dateOfEmployment || '',
        dateOfBirth: this.employee.dateOfBirth || '',
        phone: this.employee.phone || '',
        email: this.employee.email || '',
        department: this.employee.department || '',
        position: this.employee.position || '',
      };
    }
    this.requestUpdate();
  }

  render() {
    return html`
      ${this.loading
        ? html`
            <loading-spinner
              overlay
              size="large"
              message="${this.isEditMode
                ? this.t('common.updating')
                : this.t('common.creating')}"
            ></loading-spinner>
          `
        : ''}

      <form class="form-container" @submit="${this._handleSubmit}">
        <div class="form-header">
          <h2 class="form-title">
            ${this.isEditMode
              ? this.t('employeeForm.editTitle')
              : this.t('employeeForm.createTitle')}
          </h2>
          <p class="form-subtitle">
            ${this.isEditMode
              ? this.t('employeeForm.editSubtitle')
              : this.t('employeeForm.createSubtitle')}
          </p>
        </div>

        <div class="form-grid">
          <!-- Name Row -->
          <div class="form-row">
            <div class="form-group ${this.errors.firstName ? 'error' : ''}">
              <label class="form-label required" for="firstName">
                ${this.t('employeeForm.firstName')}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                class="form-input ${this.errors.firstName ? 'error' : ''}"
                .value="${this.formData.firstName}"
                @input="${this._handleInputChange}"
                placeholder="${this.t('employeeForm.firstNamePlaceholder')}"
                required
              />
              ${this.errors.firstName
                ? html`
                    <div class="error-message">⚠️ ${this.errors.firstName}</div>
                  `
                : ''}
            </div>

            <div class="form-group ${this.errors.lastName ? 'error' : ''}">
              <label class="form-label required" for="lastName">
                ${this.t('employeeForm.lastName')}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                class="form-input ${this.errors.lastName ? 'error' : ''}"
                .value="${this.formData.lastName}"
                @input="${this._handleInputChange}"
                placeholder="${this.t('employeeForm.lastNamePlaceholder')}"
                required
              />
              ${this.errors.lastName
                ? html`
                    <div class="error-message">⚠️ ${this.errors.lastName}</div>
                  `
                : ''}
            </div>
          </div>

          <!-- Email -->
          <div
            class="form-group full-width ${this.errors.email ? 'error' : ''}"
          >
            <label class="form-label required" for="email">
              ${this.t('employeeForm.emailAddress')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              class="form-input ${this.errors.email ? 'error' : ''}"
              .value="${this.formData.email}"
              @input="${this._handleInputChange}"
              placeholder="${this.t('employeeForm.emailPlaceholder')}"
              required
            />
            ${this.errors.email
              ? html` <div class="error-message">⚠️ ${this.errors.email}</div> `
              : ''}
          </div>

          <!-- Phone -->
          <div
            class="form-group full-width ${this.errors.phone ? 'error' : ''}"
          >
            <label class="form-label required" for="phone">
              ${this.t('employeeForm.phoneNumber')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              class="form-input ${this.errors.phone ? 'error' : ''}"
              .value="${this.formData.phone}"
              @input="${this._handleInputChange}"
              placeholder="${this.t('employeeForm.phonePlaceholder')}"
              required
            />
            ${this.errors.phone
              ? html` <div class="error-message">⚠️ ${this.errors.phone}</div> `
              : ''}
            <div class="help-text">${this.t('employeeForm.phoneHelp')}</div>
          </div>

          <!-- Dates Row -->
          <div class="form-row">
            <div class="form-group ${this.errors.dateOfBirth ? 'error' : ''}">
              <label class="form-label required" for="dateOfBirth">
                ${this.t('employeeForm.dateOfBirth')}
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                class="form-input ${this.errors.dateOfBirth ? 'error' : ''}"
                .value="${this.formData.dateOfBirth}"
                @input="${this._handleInputChange}"
                required
              />
              ${this.errors.dateOfBirth
                ? html`
                    <div class="error-message">
                      ⚠️ ${this.errors.dateOfBirth}
                    </div>
                  `
                : ''}
            </div>

            <div
              class="form-group ${this.errors.dateOfEmployment ? 'error' : ''}"
            >
              <label class="form-label required" for="dateOfEmployment">
                ${this.t('employeeForm.dateOfEmployment')}
              </label>
              <input
                type="date"
                id="dateOfEmployment"
                name="dateOfEmployment"
                class="form-input ${this.errors.dateOfEmployment
                  ? 'error'
                  : ''}"
                .value="${this.formData.dateOfEmployment}"
                @input="${this._handleInputChange}"
                required
              />
              ${this.errors.dateOfEmployment
                ? html`
                    <div class="error-message">
                      ⚠️ ${this.errors.dateOfEmployment}
                    </div>
                  `
                : ''}
            </div>
          </div>

          <!-- Department and Position Row -->
          <div class="form-row">
            <div class="form-group ${this.errors.department ? 'error' : ''}">
              <label class="form-label required" for="department">
                ${this.t('employeeForm.department')}
              </label>
              <select
                id="department"
                name="department"
                class="form-select ${this.errors.department ? 'error' : ''}"
                .value="${this.formData.department}"
                @change="${this._handleInputChange}"
                required
              >
                <option value="">
                  ${this.t('employeeForm.selectDepartment')}
                </option>
                <option value="Analytics">
                  ${this.t('departments.analytics')}
                </option>
                <option value="Tech">${this.t('departments.tech')}</option>
              </select>
              ${this.errors.department
                ? html`
                    <div class="error-message">
                      ⚠️ ${this.errors.department}
                    </div>
                  `
                : ''}
            </div>

            <div class="form-group ${this.errors.position ? 'error' : ''}">
              <label class="form-label required" for="position">
                ${this.t('employeeForm.position')}
              </label>
              <select
                id="position"
                name="position"
                class="form-select ${this.errors.position ? 'error' : ''}"
                .value="${this.formData.position}"
                @change="${this._handleInputChange}"
                required
              >
                <option value="">
                  ${this.t('employeeForm.selectPosition')}
                </option>
                <option value="Junior">${this.t('positions.junior')}</option>
                <option value="Medior">${this.t('positions.medior')}</option>
                <option value="Senior">${this.t('positions.senior')}</option>
              </select>
              ${this.errors.position
                ? html`
                    <div class="error-message">⚠️ ${this.errors.position}</div>
                  `
                : ''}
            </div>
          </div>
        </div>

        <div class="form-actions">
          <custom-button
            variant="secondary"
            type="button"
            @button-click="${this._handleCancel}"
          >
            ${this.t('common.cancel')}
          </custom-button>

          <custom-button
            variant="outline"
            type="button"
            @button-click="${this._handleReset}"
          >
            ${this.t('common.reset')}
          </custom-button>

          <custom-button
            variant="primary"
            type="submit"
            ?loading="${this.loading}"
          >
            ${this.isEditMode
              ? this.t('common.update')
              : this.t('common.create')}
          </custom-button>
        </div>
      </form>

      <!-- Update Confirmation Modal -->
      <confirmation-modal
        ?open="${this.showUpdateConfirmation}"
        title="${this.t('employeeForm.updateConfirmation.title')}"
        message="${this.t('employeeForm.updateConfirmation.message')}"
        warningText="${this.t('employeeForm.updateConfirmation.warning')}"
        confirmButtonText="${this.t('common.update')}"
        cancelButtonText="${this.t('common.cancel')}"
        confirmButtonVariant="primary"
        ?loading="${this.loading}"
        .data="${this.employee
          ? {
              title: `${this.formData.firstName} ${this.formData.lastName}`,
              details: `${this.formData.department} - ${this.formData.position}`,
            }
          : null}"
        @confirmation-confirmed="${this._handleUpdateConfirmed}"
        @confirmation-cancelled="${this._handleUpdateCancelled}"
      ></confirmation-modal>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
