import {combineReducers} from 'redux';
import {employeesReducer} from './employees.js';
import {uiReducer} from './ui.js';

export const rootReducer = combineReducers({
  employees: employeesReducer,
  ui: uiReducer,
});
