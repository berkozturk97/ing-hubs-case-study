class ToastService {
  constructor() {
    this._manager = null;
  }

  init(manager) {
    this._manager = manager;
  }

  getManager() {
    return this._manager;
  }

  show(message, type = 'info', duration = 4000, description = '') {
    if (!this._manager) {
      console.warn('ToastService: Manager not initialized');
      return null;
    }
    return this._manager.addToast(message, type, duration, description);
  }

  success(message, duration = 4000, description = '') {
    if (!this._manager) {
      console.warn('ToastService: Manager not initialized');
      return null;
    }
    return this._manager.success(message, duration, description);
  }

  error(message, duration = 6000, description = '') {
    if (!this._manager) {
      console.warn('ToastService: Manager not initialized');
      return null;
    }
    return this._manager.error(message, duration, description);
  }

  warning(message, duration = 5000, description = '') {
    if (!this._manager) {
      console.warn('ToastService: Manager not initialized');
      return null;
    }
    return this._manager.warning(message, duration, description);
  }

  info(message, duration = 4000, description = '') {
    if (!this._manager) {
      console.warn('ToastService: Manager not initialized');
      return null;
    }
    return this._manager.info(message, duration, description);
  }

  hide(id) {
    if (!this._manager) {
      console.warn('ToastService: Manager not initialized');
      return;
    }
    return this._manager.removeToast(id);
  }

  clear() {
    if (!this._manager) {
      console.warn('ToastService: Manager not initialized');
      return;
    }
    this._manager.toasts = [];
    this._manager.requestUpdate();
  }
}

export const toastService = new ToastService();
