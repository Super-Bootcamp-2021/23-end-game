import {
  loadingAction,
  errorAction,
  doneAction,
  canceledAction,
  tasksLoadedAction,
  workersLoadedAction,
  addedAction,
} from './store';
import * as workerSvc from './worker.client';
import * as taskSvc from './task.client';
import { Dispatch } from '@reduxjs/toolkit';

/**
 * action to add new task to database
 * @param data new task data
 */
export const add = (data: taskSvc.NewTaskData) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(loadingAction());
  try {
    const task = await taskSvc.add(data);
    dispatch(addedAction(task));
  } catch (err) {
    dispatch(errorAction(`gagal menambahkan ${data.job}`));
  }
};

/**
 * action to mark a task as done
 * @param id task id
 */
export const done = (id: number) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(loadingAction());
  try {
    await taskSvc.done(id);
    dispatch(doneAction(id));
  } catch (err) {
    dispatch(errorAction('gagal menyelesaikan pekerjaan'));
  }
};

/**
 * action to cancel a task
 * @param id task id
 */
export const cancel = (id: number) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(loadingAction());
  try {
    await taskSvc.cancel(id);
    dispatch(canceledAction(id));
  } catch (err) {
    dispatch(errorAction('gagal membatalkan pekerjaan'));
  }
};

/**
 * action to get list of tasks
 * @param dispatch
 */
export const getList = async (dispatch: Dispatch): Promise<void> => {
  dispatch(loadingAction());
  try {
    const tasks = await taskSvc.list();
    dispatch(tasksLoadedAction(tasks));
  } catch (err) {
    dispatch(errorAction('gagal memuat daftar pekerjaan'));
  }
};

/**
 * action to get list of registered workers
 * @param dispatch
 */
export const getWorkersList = async (dispatch: Dispatch): Promise<void> => {
  dispatch(loadingAction());
  try {
    const workers = await workerSvc.list();
    dispatch(workersLoadedAction(workers));
  } catch (err) {
    dispatch(errorAction('gagal membatalkan pekerjaan'));
  }
};
