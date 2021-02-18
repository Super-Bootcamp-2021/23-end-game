import { createAction, createReducer, configureStore } from '@reduxjs/toolkit';
import {
  initialState,
  error,
  loading,
  summaryLoaded,
  PerformanceSummary,
} from './reducer';
import thunkMiddleware from 'redux-thunk';

export const errorAction = createAction<Error | string | null>('error');
export const loadingAction = createAction('loading');
export const summaryLoadedAction = createAction<PerformanceSummary>(
  'summaryLoaded'
);

export const reducer = createReducer(initialState, {
  [errorAction.type]: error,
  [loadingAction.type]: loading,
  [summaryLoadedAction.type]: summaryLoaded,
});

export const store$ = configureStore({
  reducer,
  middleware: [thunkMiddleware],
});
