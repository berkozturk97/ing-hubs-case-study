import {html, fixture, expect} from '@open-wc/testing';
import sinon from 'sinon';
import '../../src/components/toast-manager.js';

suite('Toast Manager Component', () => {
  let element;

  setup(async () => {
    element = await fixture(html`<toast-manager></toast-manager>`);
  });

  teardown(() => {
    sinon.restore();
  });

  suite('Properties and Initialization', () => {
    test('should have default properties', () => {
      expect(element.toasts).to.be.an('array');
      expect(element.toasts).to.have.length(0);
      expect(element._toastCounter).to.equal(0);
    });

    test('should update toasts array', async () => {
      element.toasts = [
        {id: 'test-1', message: 'Test', type: 'info', duration: 4000},
      ];
      await element.updateComplete;

      expect(element.toasts).to.have.length(1);
      expect(element.toasts[0].message).to.equal('Test');
    });
  });

  suite('addToast Method', () => {
    test('should add toast with default parameters', () => {
      const id = element.addToast('Test message');

      expect(element.toasts).to.have.length(1);
      expect(element.toasts[0].message).to.equal('Test message');
      expect(element.toasts[0].type).to.equal('info');
      expect(element.toasts[0].duration).to.equal(4000);
      expect(element.toasts[0].description).to.equal('');
      expect(element.toasts[0].id).to.equal(id);
      expect(id).to.include('toast-1-');
    });

    test('should add toast with custom parameters', () => {
      const id = element.addToast(
        'Error message',
        'error',
        6000,
        'Error details'
      );

      expect(element.toasts).to.have.length(1);
      expect(element.toasts[0].message).to.equal('Error message');
      expect(element.toasts[0].type).to.equal('error');
      expect(element.toasts[0].duration).to.equal(6000);
      expect(element.toasts[0].description).to.equal('Error details');
      expect(element.toasts[0].id).to.equal(id);
    });
  });

  suite('Toast Types', () => {
    test('should create success toast with correct defaults', () => {
      const id = element.success('Success message');

      expect(element.toasts).to.have.length(1);
      expect(element.toasts[0].message).to.equal('Success message');
      expect(element.toasts[0].type).to.equal('success');
      expect(element.toasts[0].duration).to.equal(4000);
      expect(element.toasts[0].description).to.equal('');
      expect(element.toasts[0].id).to.equal(id);
    });

    test('should create error toast with correct defaults', () => {
      const id = element.error('Error message');

      expect(element.toasts).to.have.length(1);
      expect(element.toasts[0].message).to.equal('Error message');
      expect(element.toasts[0].type).to.equal('error');
      expect(element.toasts[0].duration).to.equal(6000);
      expect(element.toasts[0].description).to.equal('');
      expect(element.toasts[0].id).to.equal(id);
    });

    test('should create warning toast with correct defaults', () => {
      const id = element.warning('Warning message');

      expect(element.toasts).to.have.length(1);
      expect(element.toasts[0].message).to.equal('Warning message');
      expect(element.toasts[0].type).to.equal('warning');
      expect(element.toasts[0].duration).to.equal(5000);
      expect(element.toasts[0].description).to.equal('');
      expect(element.toasts[0].id).to.equal(id);
    });

    test('should create info toast with correct defaults', () => {
      const id = element.info('Info message');

      expect(element.toasts).to.have.length(1);
      expect(element.toasts[0].message).to.equal('Info message');
      expect(element.toasts[0].type).to.equal('info');
      expect(element.toasts[0].duration).to.equal(4000);
      expect(element.toasts[0].description).to.equal('');
      expect(element.toasts[0].id).to.equal(id);
    });
  });

  suite('Toast Close Event Handling', () => {
    test('should handle toast-close event', async () => {
      const id1 = element.addToast('Toast 1');
      const id2 = element.addToast('Toast 2');
      await element.updateComplete;

      expect(element.toasts).to.have.length(2);

      element._handleToastClose({detail: {id: id1}});

      expect(element.toasts).to.have.length(1);
      expect(element.toasts[0].id).to.equal(id2);
    });
  });
});
