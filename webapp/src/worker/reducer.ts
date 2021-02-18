import { PayloadAction } from '@reduxjs/toolkit';
import { SERVICE_BASEURL } from './config';

export interface State {
  loading: boolean;
  error?: Error | string | null;
  workers: Worker[];
}

export interface Worker {
  id?: number;
  name: string;
  age?: number;
  bio?: string;
  address?: string;
  photo?: string;
}

// setup state
export const initialState: State = {
  loading: false,
  error: null,
  workers: [],
};

/**
 * mark state as loading
 * @param state
 */
export function loading(state: State): State | void {
  state.loading = true;
  state.error = null;
}

/**
 * add error to state
 * @param state
 * @param action action contain error information
 */
export function error(
  state: State,
  action: PayloadAction<Error | string | null>
): State | void {
  state.loading = false;
  state.error = action.payload;
}

/**
 * clear error from state
 * @param state
 */
export function clearError(state: State): State | void {
  state.error = null;
}

/**
 * add new registered worker on worker list
 * @param state
 * @param action action with worker payload
 */
export function registered(
  state: State,
  action: PayloadAction<Worker>
): State | void {
  const worker = action.payload;
  state.workers.push({
    id: worker.id,
    name: worker.name,
    photo: `${SERVICE_BASEURL}/photo/${worker.photo}`,
    bio: worker.bio,
  });
  state.loading = false;
  state.error = null;
  return state;
}

/**
 * remove worker from list
 * @param state
 * @param action action with id payload
 */
export function removed(
  state: State,
  action: PayloadAction<number>
): State | void {
  const idx = state.workers.findIndex((t) => t.id === action.payload);
  state.workers.splice(idx, 1);
  state.loading = false;
  state.error = null;
  return state;
}

/**
 * load list of workers into state
 * @param state
 * @param action action with workers payload
 */
export function workersLoaded(
  state: State,
  action: PayloadAction<Worker[]>
): State | void {
  state.workers = action.payload.map((worker) => ({
    id: worker.id,
    name: worker.name,
    photo: `${SERVICE_BASEURL}/photo/${worker.photo}`,
    bio: worker.bio,
  }));
  state.loading = false;
  state.error = null;
  return state;
}
