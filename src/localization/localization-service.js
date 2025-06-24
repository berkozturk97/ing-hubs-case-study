import {en} from './languages/en.js';
import {tr} from './languages/tr.js';

class LocalizationService {
  constructor() {
    this.languages = {
      en,
      tr,
    };

    this.currentLanguage = this._getInitialLanguage();
    this.subscribers = [];
  }

  _getInitialLanguage() {
    const saved = localStorage.getItem('app-language');
    if (saved && this.languages[saved]) {
      return saved;
    }

    const htmlLang = document.documentElement.lang;
    if (htmlLang && this.languages[htmlLang]) {
      return htmlLang;
    }

    const browserLang = navigator.language.split('-')[0];
    if (browserLang && this.languages[browserLang]) {
      return browserLang;
    }

    return 'en';
  }

  /**
   * Set the current language
   * @param {string} language - Language code (e.g., 'en', 'tr')
   */
  setLanguage(language) {
    if (!this.languages[language]) {
      console.warn(
        `Language '${language}' is not supported. Available languages:`,
        Object.keys(this.languages)
      );
      return;
    }

    this.currentLanguage = language;

    localStorage.setItem('app-language', language);

    document.documentElement.lang = language;

    this._notifySubscribers();
  }

  /**
   * Get the current language
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get available languages
   * @returns {Array<string>} Array of available language codes
   */
  getAvailableLanguages() {
    return Object.keys(this.languages);
  }

  /**
   * Get a translation for a given key path
   * @param {string} keyPath - Dot-separated path to the translation (e.g., 'navigation.employees')
   * @param {string} language - Optional language override
   * @returns {string} Translated text or the key path if not found
   */
  getText(keyPath, language = null) {
    const lang = language || this.currentLanguage;
    const translations = this.languages[lang];

    if (!translations) {
      console.warn(`Language '${lang}' not found`);
      return keyPath;
    }

    // Navigate through the nested object using the dot-separated path
    const keys = keyPath.split('.');
    let result = translations;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        console.warn(
          `Translation key '${keyPath}' not found for language '${lang}'`
        );
        return keyPath;
      }
    }

    return typeof result === 'string' ? result : keyPath;
  }

  /**
   * Get a translation with placeholders replaced
   * @param {string} keyPath - Dot-separated path to the translation
   * @param {Object} placeholders - Object with placeholder values
   * @param {string} language - Optional language override
   * @returns {string} Translated text with placeholders replaced
   */
  getTextWithPlaceholders(keyPath, placeholders = {}, language = null) {
    let text = this.getText(keyPath, language);

    // Replace placeholders in the format {{key}}
    for (const [key, value] of Object.entries(placeholders)) {
      const placeholder = `{{${key}}}`;
      text = text.replace(new RegExp(placeholder, 'g'), value);
    }

    return text;
  }

  /**
   * Subscribe to language changes
   * @param {Function} callback - Callback function to be called when language changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  _notifySubscribers() {
    this.subscribers.forEach((callback) => {
      try {
        callback(this.currentLanguage);
      } catch (error) {
        console.error('Error in localization subscriber:', error);
      }
    });
  }

  /**
   * Get localized language name
   * @param {string} languageCode - Language code
   * @returns {string} Localized language name
   */
  getLanguageName(languageCode) {
    const languageNames = {
      en: {
        en: 'English',
        tr: 'Turkish',
      },
      tr: {
        en: 'İngilizce',
        tr: 'Türkçe',
      },
    };

    return (
      languageNames[this.currentLanguage]?.[languageCode] ||
      languageCode.toUpperCase()
    );
  }
}

export const localizationService = new LocalizationService();

export const t = (keyPath, placeholders = {}, language = null) => {
  return localizationService.getTextWithPlaceholders(
    keyPath,
    placeholders,
    language
  );
};

export {LocalizationService};
