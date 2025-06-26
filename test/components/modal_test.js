import {html, fixture, expect, oneEvent} from '@open-wc/testing';
import sinon from 'sinon';
import '../../src/components/modal.js';

suite('Modal Component', () => {
  let element;

  setup(async () => {
    element = await fixture(html`<app-modal></app-modal>`);
  });

  teardown(() => {
    document.body.style.overflow = '';
    sinon.restore();
  });

  suite('Properties and Initialization', () => {
    test('should have default properties', () => {
      expect(element.open).to.be.false;
      expect(element.title).to.equal('');
      expect(element.size).to.equal('medium');
      expect(element.loading).to.be.false;
      expect(element.showCloseButton).to.be.true;
      expect(element.closeOnBackdrop).to.be.true;
      expect(element.showFooter).to.be.true;
    });

    test('should update properties', async () => {
      element.open = true;
      element.title = 'Test Modal';
      element.size = 'large';
      element.loading = true;
      element.showCloseButton = false;
      element.closeOnBackdrop = false;
      element.showFooter = false;

      await element.updateComplete;

      expect(element.open).to.be.true;
      expect(element.title).to.equal('Test Modal');
      expect(element.size).to.equal('large');
      expect(element.loading).to.be.true;
      expect(element.showCloseButton).to.be.false;
      expect(element.closeOnBackdrop).to.be.false;
      expect(element.showFooter).to.be.false;
    });
  });

  suite('Size Variants', () => {
    test('should apply small size class', async () => {
      element.size = 'small';
      await element.updateComplete;

      const container = element.shadowRoot.querySelector('.modal-container');
      expect(container.classList.contains('small')).to.be.true;
    });

    test('should apply medium size class by default', async () => {
      const container = element.shadowRoot.querySelector('.modal-container');
      expect(container.classList.contains('medium')).to.be.true;
    });

    test('should apply large size class', async () => {
      element.size = 'large';
      await element.updateComplete;

      const container = element.shadowRoot.querySelector('.modal-container');
      expect(container.classList.contains('large')).to.be.true;
    });
  });

  suite('Open and Close Functionality', () => {
    test('should open modal with openModal method', async () => {
      const eventPromise = oneEvent(element, 'modal-opened');

      element.openModal();
      await element.updateComplete;

      expect(element.open).to.be.true;
      expect(document.body.style.overflow).to.equal('hidden');

      const event = await eventPromise;
      expect(event.type).to.equal('modal-opened');
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    test('should close modal with closeModal method', async () => {
      element.open = true;
      document.body.style.overflow = 'hidden';
      await element.updateComplete;

      const eventPromise = oneEvent(element, 'modal-closed');

      element.closeModal();
      await element.updateComplete;

      expect(element.open).to.be.false;
      expect(document.body.style.overflow).to.equal('');

      const event = await eventPromise;
      expect(event.type).to.equal('modal-closed');
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });
  });

  suite('Header Rendering', () => {
    test('should show header when title is provided', async () => {
      element.title = 'Test Title';
      await element.updateComplete;

      const header = element.shadowRoot.querySelector('.modal-header');
      const title = element.shadowRoot.querySelector('.modal-title');

      expect(header).to.exist;
      expect(title.textContent).to.equal('Test Title');
    });
  });

  suite('Loading State', () => {
    test('should show loading overlay when loading is true', async () => {
      element.loading = true;
      await element.updateComplete;

      const loadingOverlay =
        element.shadowRoot.querySelector('.loading-overlay');
      const loadingSpinner =
        element.shadowRoot.querySelector('loading-spinner');

      expect(loadingOverlay).to.exist;
      expect(loadingSpinner).to.exist;
      expect(loadingSpinner.getAttribute('size')).to.equal('large');
    });
  });

  suite('Footer Rendering', () => {
    test('should show footer when showFooter is true', async () => {
      element.showFooter = true;
      await element.updateComplete;

      const footer = element.shadowRoot.querySelector('.modal-footer');
      expect(footer).to.exist;
    });

    test('should not show footer when showFooter is false', async () => {
      element.showFooter = false;
      await element.updateComplete;

      const footer = element.shadowRoot.querySelector('.modal-footer');
      expect(footer).to.not.exist;
    });
  });

  suite('Event Handling', () => {
    test('should close modal when close button is clicked', async () => {
      element.open = true;
      await element.updateComplete;

      const closeButton = element.shadowRoot.querySelector('.close-button');
      const eventPromise = oneEvent(element, 'modal-closed');

      closeButton.click();

      await eventPromise;
      expect(element.open).to.be.false;
    });

    test('should close modal when backdrop is clicked and closeOnBackdrop is true', async () => {
      element.open = true;
      element.closeOnBackdrop = true;
      await element.updateComplete;

      const backdrop = element.shadowRoot.querySelector('.modal-backdrop');
      const eventPromise = oneEvent(element, 'modal-closed');

      backdrop.click();

      await eventPromise;
      expect(element.open).to.be.false;
    });

    test('should not close modal when backdrop is clicked and closeOnBackdrop is false', async () => {
      element.open = true;
      element.closeOnBackdrop = false;
      await element.updateComplete;

      const backdrop = element.shadowRoot.querySelector('.modal-backdrop');

      backdrop.click();
      await element.updateComplete;

      expect(element.open).to.be.true;
    });

    test('should close modal when Escape key is pressed', async () => {
      element.open = true;
      await element.updateComplete;

      const eventPromise = oneEvent(element, 'modal-closed');

      const escapeEvent = new KeyboardEvent('keydown', {key: 'Escape'});
      document.dispatchEvent(escapeEvent);

      await eventPromise;
      expect(element.open).to.be.false;
    });
  });

  suite('Lifecycle Methods(keydown event)', () => {
    test('should add keydown listener on connectedCallback', async () => {
      const addEventListenerSpy = sinon.spy(document, 'addEventListener');

      await fixture(html`<app-modal></app-modal>`);

      expect(addEventListenerSpy.calledWith('keydown')).to.be.true;
    });

    test('should remove keydown listener on disconnectedCallback', async () => {
      const removeEventListenerSpy = sinon.spy(document, 'removeEventListener');

      const newElement = await fixture(html`<app-modal></app-modal>`);
      newElement.remove();

      expect(removeEventListenerSpy.calledWith('keydown')).to.be.true;
    });

    test('should reset body overflow on disconnectedCallback', async () => {
      const newElement = await fixture(html`<app-modal></app-modal>`);
      document.body.style.overflow = 'hidden';

      newElement.remove();

      expect(document.body.style.overflow).to.equal('');
    });
  });
});
