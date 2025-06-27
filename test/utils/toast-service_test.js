import {expect} from '@open-wc/testing';
import sinon from 'sinon';
import {toastService} from '../../src/utils/toast-service.js';

suite('Toast Service', () => {
  let mockManager;
  let consoleWarnStub;

  setup(() => {
    mockManager = {
      addToast: sinon.stub().returns('toast-id'),
      success: sinon.stub().returns('success-id'),
      error: sinon.stub().returns('error-id'),
      warning: sinon.stub().returns('warning-id'),
      info: sinon.stub().returns('info-id'),
      removeToast: sinon.stub(),
      toasts: [],
      requestUpdate: sinon.stub(),
    };

    consoleWarnStub = sinon.stub(console, 'warn');
  });

  teardown(() => {
    toastService._manager = null;
    sinon.restore();
  });

  test('should initialize with manager', () => {
    toastService.init(mockManager);

    const manager = toastService.getManager();

    expect(manager).to.equal(mockManager);
  });

  test('should show toast with manager', () => {
    toastService.init(mockManager);

    const result = toastService.show(
      'Test message',
      'info',
      3000,
      'Test description'
    );

    expect(mockManager.addToast.calledOnce).to.be.true;
    expect(
      mockManager.addToast.calledWith(
        'Test message',
        'info',
        3000,
        'Test description'
      )
    ).to.be.true;
    expect(result).to.equal('toast-id');
  });

  test('should show warning when manager not initialized for show', () => {
    const result = toastService.show('Test message');

    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleWarnStub.calledWith('ToastService: Manager not initialized'))
      .to.be.true;
    expect(result).to.be.null;
  });

  test('should call success method', () => {
    toastService.init(mockManager);

    const result = toastService.success(
      'Success message',
      5000,
      'Success description'
    );

    expect(mockManager.success.calledOnce).to.be.true;
    expect(
      mockManager.success.calledWith(
        'Success message',
        5000,
        'Success description'
      )
    ).to.be.true;
    expect(result).to.equal('success-id');
  });

  test('should call error method', () => {
    toastService.init(mockManager);

    const result = toastService.error(
      'Error message',
      7000,
      'Error description'
    );

    expect(mockManager.error.calledOnce).to.be.true;
    expect(
      mockManager.error.calledWith('Error message', 7000, 'Error description')
    ).to.be.true;
    expect(result).to.equal('error-id');
  });

  test('should call warning method', () => {
    toastService.init(mockManager);

    const result = toastService.warning(
      'Warning message',
      6000,
      'Warning description'
    );

    expect(mockManager.warning.calledOnce).to.be.true;
    expect(
      mockManager.warning.calledWith(
        'Warning message',
        6000,
        'Warning description'
      )
    ).to.be.true;
    expect(result).to.equal('warning-id');
  });

  test('should call info method', () => {
    toastService.init(mockManager);

    const result = toastService.info('Info message', 4000, 'Info description');

    expect(mockManager.info.calledOnce).to.be.true;
    expect(
      mockManager.info.calledWith('Info message', 4000, 'Info description')
    ).to.be.true;
    expect(result).to.equal('info-id');
  });

  test('should hide toast', () => {
    toastService.init(mockManager);

    toastService.hide('toast-123');

    expect(mockManager.removeToast.calledOnce).to.be.true;
    expect(mockManager.removeToast.calledWith('toast-123')).to.be.true;
  });

  test('should clear all toasts', () => {
    toastService.init(mockManager);
    mockManager.toasts = ['toast1', 'toast2'];

    toastService.clear();

    expect(mockManager.toasts).to.deep.equal([]);
    expect(mockManager.requestUpdate.calledOnce).to.be.true;
  });

  test('should show warning when manager not initialized for success', () => {
    const result = toastService.success('Success message');

    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleWarnStub.calledWith('ToastService: Manager not initialized'))
      .to.be.true;
    expect(result).to.be.null;
  });

  test('should show warning when manager not initialized for error', () => {
    const result = toastService.error('Error message');

    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleWarnStub.calledWith('ToastService: Manager not initialized'))
      .to.be.true;
    expect(result).to.be.null;
  });

  test('should show warning when manager not initialized for warning', () => {
    const result = toastService.warning('Warning message');

    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleWarnStub.calledWith('ToastService: Manager not initialized'))
      .to.be.true;
    expect(result).to.be.null;
  });

  test('should show warning when manager not initialized for info', () => {
    const result = toastService.info('Info message');

    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleWarnStub.calledWith('ToastService: Manager not initialized'))
      .to.be.true;
    expect(result).to.be.null;
  });

  test('should show warning when manager not initialized for hide', () => {
    toastService.hide('toast-123');

    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleWarnStub.calledWith('ToastService: Manager not initialized'))
      .to.be.true;
  });

  test('should show warning when manager not initialized for clear', () => {
    toastService.clear();

    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleWarnStub.calledWith('ToastService: Manager not initialized'))
      .to.be.true;
  });
});
