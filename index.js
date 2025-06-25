/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import './src/components/navigation-bar.js';
import './src/components/toast-manager.js';
import {localizationService} from './src/localization/index.js';
import {AppRouter} from './src/utils/router.js';
import {connect} from 'pwa-helpers/connect-mixin.js';
import {store} from './src/store/index.js';
import {setCurrentRoute} from './src/store/actions/ui.js';
import {toastService} from './src/utils/toast-service.js';

/**
 * Employee Management Application Main Component
 */
export class App extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host {
        display: block;
        min-height: 100vh;
        margin: 0;
        padding: 0;
        font-family: 'Arial', sans-serif;
        background-color: #f5f5f5;
      }

      .app-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .main-content {
        flex: 1;
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
      }

      .welcome-section {
        background: white;
        border-radius: 8px;
        padding: 32px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
        margin-bottom: 20px;
      }

      .welcome-title {
        font-size: 32px;
        color: #333;
        margin-bottom: 16px;
        font-weight: 600;
      }

      .welcome-subtitle {
        font-size: 18px;
        color: #666;
        margin-bottom: 24px;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .stat-card {
        background: white;
        border-radius: 8px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
        transition: transform 0.2s ease;
      }

      .stat-card:hover {
        transform: translateY(-2px);
      }

      .stat-number {
        font-size: 36px;
        font-weight: bold;
        color: #ff6200;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .main-content {
          padding: 16px;
        }

        .welcome-section {
          padding: 24px 16px;
        }

        .welcome-title {
          font-size: 24px;
        }

        .welcome-subtitle {
          font-size: 16px;
        }

        .stats-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
  }

  static get properties() {
    return {
      currentRoute: {type: String},
      language: {type: String},
    };
  }

  constructor() {
    super();
    this.currentRoute = 'employees';
    this.language = localizationService.getCurrentLanguage();

    // Subscribe to language changes
    this._unsubscribeLocalization = localizationService.subscribe(
      (newLanguage) => {
        this.language = newLanguage;
      }
    );

    // Initialize sample data if no employees exist
    setTimeout(() => {
      const state = store.getState();
      if (!state.employees.list || state.employees.list.length === 0) {
        this._createSampleEmployees();
      }
    }, 100);
  }

  firstUpdated() {
    // Initialize toast service
    const toastManager = this.shadowRoot.querySelector('toast-manager');
    if (toastManager) {
      toastService.init(toastManager);
    }

    setTimeout(() => {
      const outlet = this.shadowRoot.querySelector('#outlet');
      if (outlet) {
        try {
          this.router = new AppRouter(outlet);
        } catch (error) {
          console.error('Failed to initialize router:', error);
        }
      } else {
        console.error('Router outlet not found in shadow DOM');
      }
    }, 50);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribeLocalization) {
      this._unsubscribeLocalization();
    }
  }

  render() {
    return html`
      <div class="app-container">
        <navigation-bar
          .activeRoute="${this.currentRoute}"
          .language="${this.language}"
          @navigation-change="${this._handleNavigationChange}"
          @language-change="${this._handleLanguageChange}"
        >
        </navigation-bar>

        <main class="main-content">
          <div id="outlet"></div>
        </main>

        <!-- Global Toast Manager -->
        <toast-manager></toast-manager>
      </div>
    `;
  }

  stateChanged(state) {
    // Subscribe to Redux state changes
    this.currentRoute = state.ui.currentRoute;
  }

  _handleNavigationChange(event) {
    const route = event.detail.route;

    // Update Redux state
    store.dispatch(setCurrentRoute(route));

    if (this.router) {
      const path = route === 'employees' ? '/employees' : `/${route}`;
      this.router.navigate(path);
    }
  }

  _handleLanguageChange(event) {
    this.language = event.detail.language;
    // Update document language attribute for localization
    document.documentElement.lang = this.language;
  }

  _createSampleEmployees() {
    // Import the action
    import('./src/store/actions/employees.js').then((module) => {
      const {addEmployee} = module;

      const sampleEmployees = [
        {
          firstName: 'Berk',
          lastName: 'Oz',
          email: 'berk.oz@ing.com',
          phone: '+90 (555) 123-4567',
          dateOfBirth: '1990-05-15',
          dateOfEmployment: '2025-01-15',
          department: 'Tech',
          position: 'Senior',
        },
        {
          firstName: 'Ayse',
          lastName: 'Kaya',
          email: 'ayse.kaya@ing.com',
          phone: '+90 (555) 234-5678',
          dateOfBirth: '1992-08-20',
          dateOfEmployment: '2023-03-01',
          department: 'Analytics',
          position: 'Medior',
        },
        {
          firstName: 'Cemal',
          lastName: 'Kaya',
          email: 'cemal.kaya@ing.com',
          phone: '+90 (555) 345-6789',
          dateOfBirth: '1995-12-10',
          dateOfEmployment: '2023-09-15',
          department: 'Tech',
          position: 'Junior',
        },
      ];

      sampleEmployees.forEach((employee) => {
        store.dispatch(addEmployee(employee));
      });
    });
  }
}

window.customElements.define('main-app', App);
