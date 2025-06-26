import {localizationService} from './localization-service.js';
import {store} from '../store/index.js';
import {setLanguage} from '../store/actions/ui.js';

class ReduxLocalizationService {
  constructor() {
    this.initialized = false;
    this._initializeFromStore();
  }

  _initializeFromStore() {
    if (this.initialized) return;

    const state = store.getState();
    const storeLanguage = state.ui.language;

    if (storeLanguage) {
      localizationService.setLanguage(storeLanguage);
    } else {
      const initialLanguage = this._getInitialLanguage();
      store.dispatch(setLanguage(initialLanguage));
      localizationService.setLanguage(initialLanguage);
    }

    this.initialized = true;
  }

  _getInitialLanguage() {
    const saved = localStorage.getItem('app-language');
    if (saved && localizationService.getAvailableLanguages().includes(saved)) {
      return saved;
    }

    const htmlLang = document.documentElement.lang;
    if (
      htmlLang &&
      localizationService.getAvailableLanguages().includes(htmlLang)
    ) {
      return htmlLang;
    }

    const browserLang = navigator.language.split('-')[0];
    if (
      browserLang &&
      localizationService.getAvailableLanguages().includes(browserLang)
    ) {
      return browserLang;
    }

    return 'en'; // Default fallback
  }

  changeLanguage(language) {
    if (!localizationService.getAvailableLanguages().includes(language)) {
      console.warn(`Language '${language}' is not supported`);
      return false;
    }

    store.dispatch(setLanguage(language));

    localizationService.setLanguage(language);

    localStorage.setItem('app-language', language);
    document.documentElement.lang = language;

    return true;
  }

  getCurrentLanguage() {
    const state = store.getState();
    return state.ui.language || 'en';
  }

  t(keyPath, placeholders = {}) {
    const currentLanguage = this.getCurrentLanguage();
    return localizationService.getTextWithPlaceholders(
      keyPath,
      placeholders,
      currentLanguage
    );
  }
}

export const reduxLocalizationService = new ReduxLocalizationService();

export const t = (keyPath, placeholders = {}) =>
  reduxLocalizationService.t(keyPath, placeholders);

export const changeLanguage = (language) =>
  reduxLocalizationService.changeLanguage(language);

export const getCurrentLanguage = () =>
  reduxLocalizationService.getCurrentLanguage();
