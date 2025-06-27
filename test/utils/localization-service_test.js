import {expect} from '@open-wc/testing';
import sinon from 'sinon';
import {
  localizationService,
  t,
} from '../../src/localization/localization-service.js';

suite('Localization Service', () => {
  let consoleWarnStub;
  let consoleErrorStub;
  let localStorageStub;

  setup(() => {
    consoleWarnStub = sinon.stub(console, 'warn');
    consoleErrorStub = sinon.stub(console, 'error');

    localStorageStub = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageStub,
      writable: true,
    });

    localizationService.currentLanguage = 'en';
    localizationService.subscribers = [];
  });

  teardown(() => {
    sinon.restore();
  });

  test('should set language successfully', () => {
    localizationService.setLanguage('tr');

    expect(localizationService.getCurrentLanguage()).to.equal('tr');
    expect(localStorageStub.setItem.calledWith('app-language', 'tr')).to.be
      .true;
    expect(document.documentElement.lang).to.equal('tr');
  });

  test('should warn for unsupported language', () => {
    localizationService.setLanguage('fr');

    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleWarnStub.firstCall.args[0]).to.include(
      "Language 'fr' is not supported"
    );
    expect(localizationService.getCurrentLanguage()).to.equal('en'); // Should remain unchanged
  });

  test('should get current language', () => {
    localizationService.currentLanguage = 'tr';

    const language = localizationService.getCurrentLanguage();

    expect(language).to.equal('tr');
  });

  test('should get available languages', () => {
    const languages = localizationService.getAvailableLanguages();

    expect(languages).to.include('en');
    expect(languages).to.include('tr');
    expect(languages).to.have.lengthOf(2);
  });

  test('should get text for valid key', () => {
    const text = localizationService.getText('common.edit');

    expect(text).to.be.a('string');
    expect(text).to.not.equal('common.edit'); // Should return translated text, not key
  });

  test('should return key for invalid translation key', () => {
    const text = localizationService.getText('invalid.key.path');

    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleWarnStub.firstCall.args[0]).to.include(
      "Translation key 'invalid.key.path' not found"
    );
    expect(text).to.equal('invalid.key.path');
  });

  test('should warn for invalid language in getText', () => {
    const text = localizationService.getText('common.edit', 'fr');

    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleWarnStub.firstCall.args[0]).to.include(
      "Language 'fr' not found"
    );
    expect(text).to.equal('common.edit');
  });

  test('should get text with placeholders', () => {
    const text = localizationService.getTextWithPlaceholders('common.edit', {
      name: 'John',
    });

    expect(text).to.be.a('string');
    // Should not contain {{}} if placeholders exist and are replaced
  });

  test('should subscribe to language changes', () => {
    const callback = sinon.stub();

    const unsubscribe = localizationService.subscribe(callback);

    expect(localizationService.subscribers).to.include(callback);
    expect(unsubscribe).to.be.a('function');

    unsubscribe();
    expect(localizationService.subscribers).to.not.include(callback);
  });

  test('should notify subscribers on language change', () => {
    const callback = sinon.stub();
    localizationService.subscribe(callback);

    localizationService.setLanguage('tr');

    expect(callback.calledOnce).to.be.true;
    expect(callback.calledWith('tr')).to.be.true;
  });

  test('should handle subscriber errors', () => {
    const errorCallback = sinon.stub().throws(new Error('Subscriber error'));
    localizationService.subscribe(errorCallback);

    localizationService.setLanguage('tr');

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.include(
      'Error in localization subscriber'
    );
  });

  test('should get language name', () => {
    localizationService.currentLanguage = 'en';

    const englishName = localizationService.getLanguageName('en');
    const turkishName = localizationService.getLanguageName('tr');

    expect(englishName).to.equal('English');
    expect(turkishName).to.equal('Turkish');
  });

  test('should return uppercase for unknown language name', () => {
    const unknownName = localizationService.getLanguageName('fr');

    expect(unknownName).to.equal('FR');
  });

  test('should work with t function helper', () => {
    const text = t('common.edit');

    expect(text).to.be.a('string');
    expect(text).to.not.equal('common.edit');
  });
});
