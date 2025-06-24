// localStorage middleware for persisting state
export const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  const state = store.getState();

  const persistedState = {
    employees: state.employees,
  };

  try {
    localStorage.setItem('employeeApp', JSON.stringify(persistedState));
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }

  return result;
};

export const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('employeeApp');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
    return undefined;
  }
};
