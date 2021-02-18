import { PayloadAction } from '@reduxjs/toolkit';

interface State {
  loading: boolean;
  error?: Error | string | null;
  summary: PerformanceSummary;
}

export interface PerformanceSummary {
  total_task: number;
  task_done: number;
  task_cancelled: number;
  total_worker: number;
}

export const initialState: State = {
  loading: false,
  error: null,
  summary: {
    total_task: 0,
    task_done: 0,
    task_cancelled: 0,
    total_worker: 0,
  },
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
 * load performance summary into state
 * @param state
 * @param action action contain performance summary
 */
export function summaryLoaded(
  state: State,
  action: PayloadAction<PerformanceSummary>
): State | void {
  state.summary = action.payload;
  state.loading = false;
  state.error = null;
}
