import {LitElement, html, css} from 'lit';
import {ReduxLocalizedMixin} from '../localization/redux-localized-mixin.js';
import {changeLanguage} from '../localization/redux-localization.js';

export class NavigationBar extends ReduxLocalizedMixin(LitElement) {
  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        background-color: #ffffff;
        color: white;
        font-family: 'Arial', sans-serif;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .nav-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        height: 64px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .logo-section {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .logo img,
      .logo svg {
        width: 24px;
        height: 24px;
      }

      .nav-menu {
        display: flex;
        align-items: center;
        gap: 32px;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .nav-item {
        position: relative;
      }

      .nav-link {
        color: #ff6200;
        text-decoration: none;
        font-size: 16px;
        font-weight: 500;
        padding: 8px 16px;
        border-radius: 4px;
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .nav-link:hover {
        background-color: #ffffff;
        transform: translateY(-1px);
      }

      .helper-section {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
      }

      .language-selector {
        background: none;
        border: none;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .language-selector:hover {
        background-color: #ff6200;
      }

      @media (max-width: 768px) {
        .nav-container {
          padding: 0 16px;
          height: 56px;
        }

        .nav-menu {
          gap: 16px;
        }

        .nav-link {
          padding: 6px 12px;
          font-size: 14px;
        }

        .user-info span {
          display: none;
        }
      }

      @media (max-width: 480px) {
        .nav-menu {
          gap: 8px;
        }

        .nav-link {
          padding: 4px 8px;
          font-size: 12px;
        }
      }
    `;
  }

  static get properties() {
    return {
      activeRoute: {type: String},
    };
  }

  constructor() {
    super();
    this.activeRoute = 'employees';
  }

  render() {
    return html`
      <nav class="nav-container">
        <div class="logo-section">
          <div class="logo">
            <img src="/src/assets/svgs/logo.svg" alt="ING" />
          </div>
        </div>

        <div class="helper-section">
          <ul class="nav-menu">
            <li class="nav-item">
              <a
                class="nav-link ${this.activeRoute === 'employees'
                  ? 'active'
                  : ''}"
                href="/employees"
                @click="${this._handleNavigation}"
              >
                ${this.t('navigation.employees')}
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link ${this.activeRoute === 'add-employee'
                  ? 'active'
                  : ''}"
                href="/add-employee"
                @click="${this._handleNavigation}"
              >
                ${this.t('navigation.addNew')}
              </a>
            </li>
          </ul>
          <select
            class="language-selector"
            @change="${this._handleLanguageChange}"
          >
            <option value="en" ?selected="${this._currentLanguage === 'en'}">
              🇬🇧
            </option>
            <option value="tr" ?selected="${this._currentLanguage === 'tr'}">
              🇹🇷
            </option>
          </select>
        </div>
      </nav>
    `;
  }

  _handleNavigation(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    const route = href.substring(1); // Remove leading slash

    this.activeRoute = route;
    this.dispatchEvent(
      new CustomEvent('navigation-change', {
        detail: {route},
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleLanguageChange(event) {
    const newLanguage = event.target.value;
    changeLanguage(newLanguage);
  }
}

customElements.define('navigation-bar', NavigationBar);
