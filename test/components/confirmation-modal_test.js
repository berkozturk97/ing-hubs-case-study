import {html, fixture, expect, oneEvent} from '@open-wc/testing';
import sinon from 'sinon';
import '../../src/components/confirmation-modal.js';

suite('Confirmation Modal Component', () => {
  let element;

  setup(async () => {
    element = await fixture(html`<confirmation-modal></confirmation-modal>`);
  });

  teardown(() => {
    sinon.restore();
  });

  suite('Properties and Initialization', () => {
    test('should have default properties', () => {
      expect(element.open).to.be.false;
      expect(element.title).to.equal('');
      expect(element.message).to.equal('');
      expect(element.warningText).to.equal('');
      expect(element.confirmButtonText).to.equal('Confirm');
      expect(element.cancelButtonText).to.equal('Cancel');
      expect(element.confirmButtonVariant).to.equal('primary');
      expect(element.loading).to.be.false;
      expect(element.data).to.be.null;
    });

    test('should update properties', async () => {
      element.open = true;
      element.title = 'Confirmation';
      element.message = 'Are you sure?';
      element.warningText = 'This action cannot be undone';
      element.confirmButtonText = 'Delete';
      element.cancelButtonText = 'Cancel';
      element.confirmButtonVariant = 'danger';
      element.loading = true;
      element.data = {title: 'Test', details: 'Details'};

      await element.updateComplete;

      expect(element.open).to.be.true;
      expect(element.title).to.equal('Confirmation');
      expect(element.message).to.equal('Are you sure?');
      expect(element.warningText).to.equal('This action cannot be undone');
      expect(element.confirmButtonText).to.equal('Delete');
      expect(element.cancelButtonText).to.equal('Cancel');
      expect(element.confirmButtonVariant).to.equal('danger');
      expect(element.loading).to.be.true;
      expect(element.data.title).to.equal('Test');
    });
  });

  suite('Modal Integration', () => {
    test('should pass correct properties to modal', async () => {
      element.open = true;
      element.title = 'Test Title';
      element.loading = true;
      await element.updateComplete;

      const modal = element.shadowRoot.querySelector('app-modal');
      expect(modal.open).to.be.true;
      expect(modal.title).to.equal('Test Title');
      expect(modal.size).to.equal('small');
      expect(modal.loading).to.be.true;
      expect(modal.closeOnBackdrop).to.be.false;
    });

    test('should allow backdrop close when not loading', async () => {
      element.open = true;
      element.loading = false;
      await element.updateComplete;

      const modal = element.shadowRoot.querySelector('app-modal');
      expect(modal.closeOnBackdrop).to.be.true;
    });
  });

  suite('Open and Close Functionality', () => {
    test('should open modal with openModal method', async () => {
      const modal = element.shadowRoot.querySelector('app-modal');
      const openModalSpy = sinon.spy(modal, 'openModal');

      element.openModal();
      await element.updateComplete;

      expect(element.open).to.be.true;
      expect(openModalSpy.calledOnce).to.be.true;
    });

    test('should close modal with closeModal method', async () => {
      element.open = true;
      await element.updateComplete;

      const modal = element.shadowRoot.querySelector('app-modal');
      const closeModalSpy = sinon.spy(modal, 'closeModal');

      element.closeModal();
      await element.updateComplete;

      expect(element.open).to.be.false;
      expect(closeModalSpy.calledOnce).to.be.true;
    });
  });

  suite('Icon Display', () => {
    test('should show warning icon for danger variant', async () => {
      element.confirmButtonVariant = 'danger';
      await element.updateComplete;

      const icon = element.shadowRoot.querySelector('.icon');
      expect(icon.textContent.trim()).to.equal('⚠️');
      expect(icon.classList.contains('warning')).to.be.true;
    });

    test('should show question icon for primary variant', async () => {
      element.confirmButtonVariant = 'primary';
      await element.updateComplete;

      const icon = element.shadowRoot.querySelector('.icon');
      expect(icon.textContent.trim()).to.equal('❓');
      expect(icon.classList.contains('question')).to.be.true;
    });

    test('should show info icon for secondary variant', async () => {
      element.confirmButtonVariant = 'secondary';
      await element.updateComplete;

      const icon = element.shadowRoot.querySelector('.icon');
      expect(icon.textContent.trim()).to.equal('ℹ️');
      expect(icon.classList.contains('info')).to.be.true;
    });
  });

  suite('Content Rendering', () => {
    test('should display message', async () => {
      element.message = 'Are you sure you want to delete this item?';
      await element.updateComplete;

      const messageElement = element.shadowRoot.querySelector(
        '.confirmation-message'
      );
      expect(messageElement.textContent).to.equal(
        'Are you sure you want to delete this item?'
      );
    });

    test('should display warning text when provided', async () => {
      element.warningText = 'This action cannot be undone';
      await element.updateComplete;

      const warningElement = element.shadowRoot.querySelector('.warning-text');
      expect(warningElement).to.exist;
      expect(warningElement.textContent).to.equal(
        'This action cannot be undone'
      );
    });
  });

  suite('Data Info Section', () => {
    test('should display data info when data is provided', async () => {
      element.data = {
        title: 'Employee: Berk Ozturk',
        details: 'Department: IT, Position: Senior',
      };
      await element.updateComplete;

      const dataInfo = element.shadowRoot.querySelector('.data-info');
      const dataTitle = element.shadowRoot.querySelector('.data-title');
      const dataDetails = element.shadowRoot.querySelector('.data-details');

      expect(dataInfo).to.exist;
      expect(dataTitle.textContent.trim()).to.equal('Employee: Berk Ozturk');
      expect(dataDetails.textContent.trim()).to.equal(
        'Department: IT, Position: Senior'
      );
    });
  });

  suite('Button Functionality', () => {
    test('should display custom button texts', async () => {
      element.confirmButtonText = 'Delete';
      element.cancelButtonText = 'Cancel';
      await element.updateComplete;

      const buttons = element.shadowRoot.querySelectorAll('custom-button');
      const cancelButton = buttons[0];
      const confirmButton = buttons[1];

      expect(cancelButton.textContent.trim()).to.equal('Cancel');
      expect(confirmButton.textContent.trim()).to.equal('Delete');
    });

    test('should disable buttons when loading', async () => {
      element.loading = true;
      await element.updateComplete;

      const buttons = element.shadowRoot.querySelectorAll('custom-button');
      const cancelButton = buttons[0];
      const confirmButton = buttons[1];

      expect(cancelButton.disabled).to.be.true;
      expect(confirmButton.loading).to.be.true;
    });
  });

  suite('Event Handling', () => {
    test('should handle cancel button click', async () => {
      const eventPromise = oneEvent(element, 'confirmation-cancelled');
      const closeModalSpy = sinon.spy(element, 'closeModal');

      await element.updateComplete;
      const cancelButton =
        element.shadowRoot.querySelectorAll('custom-button')[0];

      cancelButton.dispatchEvent(
        new CustomEvent('button-click', {
          bubbles: true,
          composed: true,
        })
      );

      const event = await eventPromise;
      expect(event.type).to.equal('confirmation-cancelled');
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
      expect(closeModalSpy.calledOnce).to.be.true;
    });

    test('should handle confirm button click', async () => {
      element.data = {id: 123, name: 'Test'};
      const eventPromise = oneEvent(element, 'confirmation-confirmed');

      await element.updateComplete;
      const confirmButton =
        element.shadowRoot.querySelectorAll('custom-button')[1];

      confirmButton.dispatchEvent(
        new CustomEvent('button-click', {
          bubbles: true,
          composed: true,
        })
      );

      const event = await eventPromise;
      expect(event.type).to.equal('confirmation-confirmed');
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
      expect(event.detail.data).to.deep.equal({id: 123, name: 'Test'});
    });
  });
});
