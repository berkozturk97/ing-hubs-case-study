import {html, fixture, expect, oneEvent} from '@open-wc/testing';
import '../../src/components/custom-button.js';

suite('CustomButton', () => {
  let element;

  setup(async () => {
    element = await fixture(html`<custom-button>Test Button</custom-button>`);
  });

  suite('Initialization and Default Properties', () => {
    test('should have default properties set correctly', () => {
      expect(element.variant).to.equal('primary');
      expect(element.size).to.equal('medium');
      expect(element.disabled).to.be.false;
      expect(element.loading).to.be.false;
      expect(element.fullWidth).to.be.false;
      expect(element.type).to.equal('button');
    });
  });

  suite('Variant Properties', () => {
    test('should apply primary variant class', async () => {
      element.variant = 'primary';
      await element.updateComplete;
      const button = element.shadowRoot.querySelector('.button');
      expect(button.classList.contains('primary')).to.be.true;
    });

    test('should apply secondary variant class', async () => {
      element.variant = 'secondary';
      await element.updateComplete;
      const button = element.shadowRoot.querySelector('.button');
      expect(button.classList.contains('secondary')).to.be.true;
    });

    test('should apply danger variant class', async () => {
      element.variant = 'danger';
      await element.updateComplete;
      const button = element.shadowRoot.querySelector('.button');
      expect(button.classList.contains('danger')).to.be.true;
    });

    test('should apply outline variant class', async () => {
      element.variant = 'outline';
      await element.updateComplete;
      const button = element.shadowRoot.querySelector('.button');
      expect(button.classList.contains('outline')).to.be.true;
    });
  });

  suite('Size Properties', () => {
    test('should apply small size class', async () => {
      element.size = 'small';
      await element.updateComplete;
      const button = element.shadowRoot.querySelector('.button');
      expect(button.classList.contains('small')).to.be.true;
    });

    test('should apply medium size class by default', () => {
      const button = element.shadowRoot.querySelector('.button');
      expect(button.classList.contains('medium')).to.be.true;
    });

    test('should apply large size class', async () => {
      element.size = 'large';
      await element.updateComplete;
      const button = element.shadowRoot.querySelector('.button');
      expect(button.classList.contains('large')).to.be.true;
    });
  });

  suite('Disabled State', () => {
    test('should set disabled attribute on button when disabled is true', async () => {
      element.disabled = true;
      await element.updateComplete;
      const button = element.shadowRoot.querySelector('.button');
      expect(button.disabled).to.be.true;
    });

    test('should not prevent clicks when disabled is false', async () => {
      element.disabled = false;
      await element.updateComplete;
      const button = element.shadowRoot.querySelector('.button');
      expect(button.disabled).to.be.false;
    });
  });

  suite('Loading State', () => {
    test('should add loading class when loading is true', async () => {
      element.loading = true;
      await element.updateComplete;
      const button = element.shadowRoot.querySelector('.button');
      expect(button.classList.contains('loading')).to.be.true;
    });

    test('should disable button when loading is true', async () => {
      element.loading = true;
      await element.updateComplete;
      const button = element.shadowRoot.querySelector('.button');
      expect(button.disabled).to.be.true;
    });

    test('should not show loading spinner when loading is false', async () => {
      element.loading = false;
      await element.updateComplete;
      const spinner = element.shadowRoot.querySelector('.loading-spinner');
      expect(spinner).to.not.exist;
    });
  });

  suite('Button Type', () => {
    test('should set button type attribute', async () => {
      element.type = 'submit';
      await element.updateComplete;
      const button = element.shadowRoot.querySelector('.button');
      expect(button.type).to.equal('submit');
    });

    test('should default to button type', () => {
      const button = element.shadowRoot.querySelector('.button');
      expect(button.type).to.equal('button');
    });
  });

  suite('Click Events', () => {
    test('should dispatch button-click event on click', async () => {
      const clickPromise = oneEvent(element, 'button-click');
      const button = element.shadowRoot.querySelector('.button');
      button.click();
      const event = await clickPromise;
      expect(event.type).to.equal('button-click');
      expect(event.detail).to.exist;
      expect(event.detail.originalEvent).to.exist;
    });

    test('should not dispatch click event when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      let eventFired = false;
      element.addEventListener('button-click', () => {
        eventFired = true;
      });

      const button = element.shadowRoot.querySelector('.button');
      button.click();

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(eventFired).to.be.false;
    });

    test('should call preventDefault and stopPropagation when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      let preventDefaultCalled = false;
      let stopPropagationCalled = false;

      const mockEvent = {
        preventDefault: () => {
          preventDefaultCalled = true;
        },
        stopPropagation: () => {
          stopPropagationCalled = true;
        },
      };

      element._handleClick(mockEvent);

      expect(preventDefaultCalled).to.be.true;
      expect(stopPropagationCalled).to.be.true;
    });

    test('should not dispatch click event when loading', async () => {
      element.loading = true;
      await element.updateComplete;

      let eventFired = false;
      element.addEventListener('button-click', () => {
        eventFired = true;
      });

      const button = element.shadowRoot.querySelector('.button');
      button.click();

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(eventFired).to.be.false;
    });

    test('should call preventDefault and stopPropagation when loading', async () => {
      element.loading = true;
      await element.updateComplete;

      let preventDefaultCalled = false;
      let stopPropagationCalled = false;

      const mockEvent = {
        preventDefault: () => {
          preventDefaultCalled = true;
        },
        stopPropagation: () => {
          stopPropagationCalled = true;
        },
      };

      element._handleClick(mockEvent);

      expect(preventDefaultCalled).to.be.true;
      expect(stopPropagationCalled).to.be.true;
    });
  });

  suite('Submit Functionality', () => {
    test('should dispatch submit event to parent form when type is submit', async () => {
      const form = await fixture(html`
        <form>
          <custom-button type="submit">Submit</custom-button>
        </form>
      `);

      const submitButton = form.querySelector('custom-button');
      let submitEventFired = false;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitEventFired = true;
      });

      const button = submitButton.shadowRoot.querySelector('.button');
      button.click();

      expect(submitEventFired).to.be.true;
    });
  });
});
