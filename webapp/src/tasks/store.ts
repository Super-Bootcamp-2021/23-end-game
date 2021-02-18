import { createAction, createReducer, configureStore } from '@reduxjs/toolkit';
import {
  initialState,
  error,
  loading,
  added,
  canceled,
  done,
  tasksLoaded,
  workersLoaded,
  clearError,
  TaskData,
  WorkerData,
} from './reducer';
import thunkMiddleware from 'redux-thunk';

export const errorAction = createAction<Error | string | null>('error');
export const loadingAction = createAction('loading');
export const addedAction = createAction<TaskData>('added');
export const doneAction = createAction<number>('done');
export const canceledAction = createAction<number>('canceled');
export const tasksLoadedAction = createAction<TaskData[]>('tasksLoaded');
export const workersLoadedAction = createAction<WorkerData[]>('workersLoaded');
export const clearErrorAction = createAction('clearError');

export const reducer = createReducer(initialState, {
  [errorAction.type]: error,
  [clearErrorAction.type]: clearError,
  [loadingAction.type]: loading,
  [doneAction.type]: done,
  [addedAction.type]: added,
  [canceledAction.type]: canceled,
  [workersLoadedAction.type]: workersLoaded,
  [tasksLoadedAction.type]: tasksLoaded,
});

export const store$ = configureStore({
  reducer,
  middleware: [thunkMiddleware],
});
