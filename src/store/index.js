import {configureStore} from '@reduxjs/toolkit';
import {rootReducer} from './reducers/index.js';
import {
  localStorageMiddleware,
  loadStateFromLocalStorage,
} from './middleware/localStorage.js';

// Load persisted state
const persistedState = loadStateFromLocalStorage();

// Configure store with Redux Toolkit
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(localStorageMiddleware),
  devTools: true, // Enable Redux DevTools in development
});

// For TypeScript projects, you would export these types:
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
