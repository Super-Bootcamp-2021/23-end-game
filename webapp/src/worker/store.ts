import { createAction, createReducer, configureStore } from '@reduxjs/toolkit';
import {
  initialState,
  error,
  loading,
  registered,
  removed,
  workersLoaded,
  clearError,
} from './reducer';
import thunkMiddleware from 'redux-thunk';
import { Worker } from './reducer';

export const errorAction = createAction<Error | string | null>('error');
export const loadingAction = createAction('loading');
export const registeredAction = createAction<Worker>('registered');
export const removedAction = createAction<number>('removed');
export const workersLoadedAction = createAction<Worker[]>('workersLoaded');
export const clearErrorAction = createAction('clearError');

export const reducer = createReducer(initialState, {
  [errorAction.type]: error,
  [clearErrorAction.type]: clearError,
  [loadingAction.type]: loading,
  [registeredAction.type]: registered,
  [removedAction.type]: removed,
  [workersLoadedAction.type]: workersLoaded,
});

export const store$ = configureStore({
  reducer,
  middleware: [thunkMiddleware],
});
