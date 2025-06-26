import {html, fixture, expect} from '@open-wc/testing';
import '../../src/components/loading-spinner.js';

suite('LoadingSpinner', () => {
  let element;

  setup(async () => {
    element = await fixture(html`<loading-spinner></loading-spinner>`);
  });

  suite('Default Properties', () => {
    test('should have default properties', () => {
      expect(element.size).to.equal('medium');
      expect(element.color).to.equal('#ff6200');
      expect(element.message).to.equal('');
      expect(element.overlay).to.be.false;
    });

    test('should render spinner with default medium size', () => {
      const spinner = element.shadowRoot.querySelector('.spinner');
      expect(spinner).to.exist;
      expect(spinner.classList.contains('medium')).to.be.true;
    });
  });

  suite('Size Property', () => {
    test('should apply small size class', async () => {
      element.size = 'small';
      await element.updateComplete;
      const spinner = element.shadowRoot.querySelector('.spinner');
      expect(spinner.classList.contains('small')).to.be.true;
    });

    test('should apply large size class', async () => {
      element.size = 'large';
      await element.updateComplete;
      const spinner = element.shadowRoot.querySelector('.spinner');
      expect(spinner.classList.contains('large')).to.be.true;
    });
  });

  suite('Overlay Property', () => {
    test('should apply overlay-size when overlay is true', async () => {
      element.overlay = true;
      await element.updateComplete;
      const spinner = element.shadowRoot.querySelector('.spinner');
      expect(spinner.classList.contains('overlay-size')).to.be.true;
      expect(element.hasAttribute('overlay')).to.be.true;
    });
  });

  suite('Color Property', () => {
    test('should apply custom color', async () => {
      element.color = '#ff0000';
      await element.updateComplete;
      const spinner = element.shadowRoot.querySelector('.spinner');
      expect(spinner.style.getPropertyValue('--spinner-color')).to.equal(
        '#ff0000'
      );
    });
  });

  suite('Message Property', () => {
    test('should not show message when empty', () => {
      const message = element.shadowRoot.querySelector('.message');
      expect(message).to.not.exist;
    });

    test('should show message when provided', async () => {
      element.message = 'Loading...';
      await element.updateComplete;
      const message = element.shadowRoot.querySelector('.message');
      expect(message).to.exist;
      expect(message.textContent).to.equal('Loading...');
    });
  });
});
