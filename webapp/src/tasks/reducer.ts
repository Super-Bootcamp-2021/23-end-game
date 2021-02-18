import { PayloadAction } from '@reduxjs/toolkit';
import { SERVICE_BASEURL } from './config';

export interface State {
  loading: boolean;
  error?: Error | string | null;
  workers: Worker[];
  tasks: Task[];
}

export interface Task {
  id?: number;
  job: string;
  assignee: string;
  done: boolean;
  attachment: string;
}

export interface Worker {
  id: number;
  name: string;
}

export interface TaskData {
  id: number;
  job: string;
  cancelled: boolean;
  done: boolean;
  attachment: string;
  addedAt: Date;
  assignee: WorkerData;
}

export interface WorkerData {
  id: number;
  name: string;
  age: number;
  bio: string;
  address: string;
  photo: string;
}

// setup state
export const initialState: State = {
  loading: false,
  error: null,
  workers: [],
  tasks: [],
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
 * add new added task to tasks list
 * @param state
 * @param action action with task payload
 */
export function added(
  state: State,
  action: PayloadAction<TaskData>
): State | void {
  const task = action.payload;
  state.tasks.push({
    id: task.id,
    job: task.job,
    assignee: task.assignee.name,
    attachment: `${SERVICE_BASEURL}/attachment/${task.attachment}`,
    done: false,
  });
  state.loading = false;
  state.error = null;
  return state;
}

/**
 * mark a task as done
 * @param state
 * @param action action with task id payload
 */
export function done(
  state: State,
  action: PayloadAction<number>
): State | void {
  const idx = state.tasks.findIndex((t) => t.id === action.payload);
  state.tasks[idx].done = true;
  state.loading = false;
  state.error = null;
  return state;
}

/**
 * mark a task as canceled
 * @param state
 * @param action action with task id payload
 */
export function canceled(
  state: State,
  action: PayloadAction<number>
): State | void {
  const idx = state.tasks.findIndex((t) => t.id === action.payload);
  state.tasks.splice(idx, 1);
  state.loading = false;
  state.error = null;
  return state;
}

/**
 * load task data into tasks list on state
 * @param state
 * @param action action with tasks payload
 */
export function tasksLoaded(
  state: State,
  action: PayloadAction<TaskData[]>
): State | void {
  state.tasks = action.payload
    .filter((t) => !t.cancelled)
    .map((task) => ({
      id: task.id,
      job: task.job,
      assignee: task.assignee.name,
      attachment: `${SERVICE_BASEURL}/attachment/${task.attachment}`,
      done: task.done,
    }));
  state.loading = false;
  state.error = null;
  return state;
}

/**
 * load worker data into workers list on state
 * @param state
 * @param action action with workers data payload
 */
export function workersLoaded(
  state: State,
  action: PayloadAction<WorkerData[]>
): State | void {
  state.workers = action.payload.map((worker) => ({
    id: worker.id,
    name: worker.name,
  }));
  state.loading = false;
  state.error = null;
  return state;
}
