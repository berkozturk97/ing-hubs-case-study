import {Router} from '@vaadin/router';

// Import page components
import '../pages/list-employee-page.js';
import '../pages/create-employee-page.js';
import '../pages/edit-employee-page.js';

export class AppRouter {
  constructor(outlet) {
    if (!outlet) {
      throw new Error('Router outlet element is required');
    }
    this.router = new Router(outlet);
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.setRoutes([
      {
        path: '/',
        redirect: '/employees',
      },
      {
        path: '/employees',
        component: 'list-employee-page',
      },
      {
        path: '/add-employee',
        component: 'create-employee-page',
      },
      {
        path: '/edit-employee/:id',
        component: 'edit-employee-page',
      },
      {
        path: '(.*)',
        redirect: '/employees',
      },
    ]);
  }

  // Navigate programmatically
  navigate(path) {
    Router.go(path);
  }

  // Get current location
  getCurrentLocation() {
    return this.router.location;
  }
}

// Export the class, not a singleton instance
// The instance will be created in the main app component
