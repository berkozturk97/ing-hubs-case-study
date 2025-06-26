import {connect} from 'pwa-helpers/connect-mixin.js';
import {store} from '../store/index.js';
import {t, getCurrentLanguage} from './redux-localization.js';

export const ReduxLocalizedMixin = (superClass) =>
  class extends connect(store)(superClass) {
    static get properties() {
      return {
        ...super.properties,
        _currentLanguage: {type: String, state: true},
      };
    }

    constructor() {
      super();
      this._currentLanguage = getCurrentLanguage();
    }

    stateChanged(state) {
      if (super.stateChanged) {
        super.stateChanged(state);
      }

      const newLanguage = state.ui.language || 'en';
      if (this._currentLanguage !== newLanguage) {
        this._currentLanguage = newLanguage;
      }
    }

    /**
     * Get translation with current language from Redux store
     * @param {string} keyPath - Dot-separated path to the translation
     * @param {Object} placeholders - Placeholder values
     * @returns {string} Translated text
     */
    t(keyPath, placeholders = {}) {
      return t(keyPath, placeholders);
    }

    /**
     * Get current language from Redux store
     * @returns {string}
     */
    getCurrentLanguage() {
      return getCurrentLanguage();
    }
  };
