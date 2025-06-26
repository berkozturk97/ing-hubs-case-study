import {html, fixture, expect, oneEvent} from '@open-wc/testing';
import '../../src/components/toast.js';

suite('Toast', () => {
  let element;

  setup(async () => {
    element = await fixture(
      html`<app-toast message="Test message"></app-toast>`
    );
  });

  suite('Default Properties', () => {
    test('should have default properties', () => {
      expect(element.message).to.equal('Test message');
      expect(element.type).to.equal('info');
      expect(element.duration).to.equal(4000);
      expect(element.visible).to.be.false;
      expect(element.id).to.equal('');
    });

    test('should render toast with default info type', () => {
      const toast = element.shadowRoot.querySelector('.toast');
      expect(toast).to.exist;
      expect(toast.classList.contains('info')).to.be.true;
    });
  });

  suite('Toast Types', () => {
    test('should apply success type class', async () => {
      element.type = 'success';
      await element.updateComplete;
      const toast = element.shadowRoot.querySelector('.toast');
      expect(toast.classList.contains('success')).to.be.true;
    });

    test('should apply error type class', async () => {
      element.type = 'error';
      await element.updateComplete;
      const toast = element.shadowRoot.querySelector('.toast');
      expect(toast.classList.contains('error')).to.be.true;
    });

    test('should apply warning type class', async () => {
      element.type = 'warning';
      await element.updateComplete;
      const toast = element.shadowRoot.querySelector('.toast');
      expect(toast.classList.contains('warning')).to.be.true;
    });
  });

  suite('Icons', () => {
    test('should show info icon by default', () => {
      const icon = element.shadowRoot.querySelector('.toast-icon');
      expect(icon.textContent).to.equal('ℹ️');
    });

    test('should show success icon', async () => {
      element.type = 'success';
      await element.updateComplete;
      const icon = element.shadowRoot.querySelector('.toast-icon');
      expect(icon.textContent).to.equal('✅');
    });

    test('should show error icon', async () => {
      element.type = 'error';
      await element.updateComplete;
      const icon = element.shadowRoot.querySelector('.toast-icon');
      expect(icon.textContent).to.equal('❌');
    });

    test('should show warning icon', async () => {
      element.type = 'warning';
      await element.updateComplete;
      const icon = element.shadowRoot.querySelector('.toast-icon');
      expect(icon.textContent).to.equal('⚠️');
    });
  });

  suite('Progress Bar', () => {
    test('should show progress bar when duration > 0', () => {
      const progress = element.shadowRoot.querySelector('.toast-progress');
      expect(progress).to.exist;
    });

    test('should not show progress bar when duration is 0', async () => {
      element.duration = 0;
      await element.updateComplete;
      const progress = element.shadowRoot.querySelector('.toast-progress');
      expect(progress).to.not.exist;
    });
  });

  suite('Close Functionality', () => {
    test('should dispatch toast-close event when close button clicked', async () => {
      element.id = 'test-toast';
      const closePromise = oneEvent(element, 'toast-close');

      const closeButton = element.shadowRoot.querySelector('.toast-close');
      closeButton.click();

      const event = await closePromise;
      expect(event.detail.id).to.equal('test-toast');
    });

    test('should call hide method when close button clicked', async () => {
      let hideCalled = false;
      const originalHide = element.hide;
      element.hide = () => {
        hideCalled = true;
        originalHide.call(element);
      };

      const closeButton = element.shadowRoot.querySelector('.toast-close');
      closeButton.click();

      expect(hideCalled).to.be.true;
    });
  });

  suite('Visibility', () => {
    test('should add hide class when not visible', () => {
      element.visible = false;
      element.requestUpdate();
      const toast = element.shadowRoot.querySelector('.toast');
      expect(toast.classList.contains('hide')).to.be.true;
    });

    test('should not have hide class when visible', async () => {
      element.visible = true;
      await element.updateComplete;
      const toast = element.shadowRoot.querySelector('.toast');
      expect(toast.classList.contains('hide')).to.be.false;
    });
  });

  suite('Message Content', () => {
    test('should display message content', () => {
      const messageSlot = element.shadowRoot.querySelector(
        'slot[name="message"]'
      );
      expect(messageSlot.textContent).to.include('Test message');
    });
  });

  suite('Auto Hide Timer', () => {
    test('should automatically call hide after duration', async () => {
      const quickToast = await fixture(
        html`<app-toast message="Quick test" duration="50"></app-toast>`
      );

      let hideCalled = false;
      const originalHide = quickToast.hide;
      quickToast.hide = () => {
        hideCalled = true;
        originalHide.call(quickToast);
      };

      // Wait longer than the duration
      await new window.Promise((resolve) => setTimeout(resolve, 100));

      expect(hideCalled).to.be.true;
    });
  });
});
