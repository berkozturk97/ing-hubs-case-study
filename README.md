# 🏢 ING Hubs Case Study

<div align="center">

![Project Status](https://img.shields.io/badge/status-completed-brightgreen)
![LitElement](https://img.shields.io/badge/LitElement-3.2.0-blue?style=flat&logo=lit&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2021-yellow?style=flat&logo=javascript&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-5.0.1-purple?style=flat&logo=redux&logoColor=white)
![Web Components](https://img.shields.io/badge/Web_Components-native-green?style=flat)
![Testing](https://img.shields.io/badge/Testing-Web_Test_Runner-orange?style=flat)

**A modern, scalable employee management system built with LitElement and Web Components, showcasing advanced patterns with comprehensive CRUD operations, internationalization, and responsive design.**


</div>

---

## 📋 Table of Contents

- [🏢 ING Hubs Case Study](#-ing-hubs-case-study)
  - [📋 Table of Contents](#-table-of-contents)
  - [✨ Project Overview](#-project-overview)
  - [🚀 Key Features](#-key-features)
  - [🏗️ Project Architecture](#️-project-architecture)
    - [📁 Folder Structure](#-folder-structure)
    - [🔧 Architecture Patterns](#-architecture-patterns)
  - [⚡ Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Development](#development)
---

## ✨ Project Overview

ING Hubs Case Study is a comprehensive **LitElement Web Components application** that demonstrates modern frontend development practices through a complete employee management system. Built as a showcase of technical expertise, this project implements advanced patterns including internationalization, Redux state management, responsive design, and comprehensive testing coverage.

**🎯 Project Goals:**
- Demonstrate proficiency in modern Web Components development
- Showcase advanced state management with Redux
- Implement professional UX patterns and responsive design
- Provide a scalable, maintainable component-based architecture
- Highlight internationalization and accessibility best practices

**🔍 What Makes This Special:**
- **Native Web Components** with LitElement for maximum compatibility
- **Production-ready** patterns with comprehensive error handling
- **Accessibility-first** design with ARIA support and keyboard navigation
- **Mobile-responsive** interface with touch-friendly interactions
- **Internationalization** support with English and Turkish languages
- **Comprehensive testing** with high coverage and quality metrics

---

## 🚀 Key Features

### 📊 Employee Management
- **Complete CRUD Operations**: Create, read, update, and delete employees with validation
- **Advanced Search System**: Real-time search across all employee fields
- **Multiple View Modes**: Toggle between table and list views for different use cases
- **Pagination System**: Efficient data navigation with customizable page sizes

### 🎨 User Interface
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Modal System**: Portal-based modals with smooth animations and focus management
- **Toast Notifications**: Contextual feedback with success/error messaging
- **View Toggle**: Switch between table and list views seamlessly

---

## 🏗️ Project Architecture

### 📁 Folder Structure

```
src/
├── 📁 components/          # Reusable UI components
│   ├── 🎨 modal.js         # Portal-based modal system
│   ├── 📝 employee-form.js # Employee creation/editing forms
│   ├── 📊 employee-table.js # Sortable, responsive data table
│   ├── 📋 employee-list.js # Card-based list view
│   ├── 🔍 search-bar.js    # Real-time search component
│   ├── 📄 pagination.js    # Advanced pagination controls
│   ├── 🍞 toast.js         # Notification toast component
│   ├── ⏳ loading-spinner.js # Loading state indicators
│   ├── 🔘 custom-button.js # Themed button component
│   └── 🚪 navigation-bar.js # App navigation header
├── 📁 pages/               # Page-level components
│   ├── 📋 list-employee-page.js # Employee listing interface
│   ├── ➕ create-employee-page.js # Employee creation page
│   └── ✏️ edit-employee-page.js # Employee editing interface
├── 📁 store/               # Redux store configuration
│   ├── 🏪 index.js         # Store setup with middleware
│   ├── 📁 actions/         # Redux action creators
│   │   ├── 👥 employees.js # Employee-related actions
│   │   ├── 🎨 ui.js        # UI state actions
│   │   └── 🏷️ types.js     # Action type constants
│   ├── 📁 reducers/        # Redux reducers
│   │   ├── 👥 employees.js # Employee state management
│   │   ├── 🎨 ui.js        # UI state management
│   │   └── 📋 index.js     # Root reducer combination
│   └── 📁 middleware/      # Custom Redux middleware
│       └── 💾 localStorage.js # Local storage persistence
├── 📁 localization/        # Internationalization
│   ├── 🌍 index.js         # Localization setup
│   ├── 🔧 localization-service.js # Language management
│   ├── 🔗 redux-localization.js # Redux localization integration
│   ├── 🎭 redux-localized-mixin.js # Localization mixin for components
│   └── 📁 languages/       # Language files
│       ├── 🇺🇸 en.js       # English translations
│       └── 🇹🇷 tr.js       # Turkish translations
├── 📁 utils/               # Utility functions
│   ├── 🛤️ router.js        # Routing configuration
│   └── 🍞 toast-service.js # Toast notification service
└── 📁 assets/              # Static assets
    └── 📁 svgs/            # SVG icons and graphics
        └── 🏢 logo.svg     # Application logo
```

---

## ⚡ Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

You can verify your installations:

```bash
node --version    # Should show v18.0.0+
npm --version     # Should show 8.0.0+
git --version     # Should show any recent version
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ing-hubs-case-study.git
   cd ing-hubs-case-study
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm run lint      # Check code quality
   npm test          # Run test suite
   npm run test:coverage # Check coverage
   ```

### Development

**🚀 Start the development server:**
```bash
npm run serve
```

**📊 View Test Coverage:**

After running the test coverage command, you can view the detailed coverage report:

```bash
npm run test:coverage
```

Then open the coverage report in your browser:
- **Coverage Report**: [coverage/lcov-report/index.html](coverage/lcov-report/index.html)

The coverage report provides detailed information about:
- Line coverage across all components
- Function coverage statistics  
- Branch coverage analysis
- Uncovered code highlighting





