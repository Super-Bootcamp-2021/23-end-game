import { Dispatch } from '@reduxjs/toolkit';
import {
  loadingAction,
  errorAction,
  registeredAction,
  removedAction,
  workersLoadedAction,
} from './store';
import * as workerSvc from './worker.client';
import { WorkerData } from './worker.client';

/**
 * action to register a new worker
 * @param data new worker data
 */
export const register = (data: WorkerData) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(loadingAction());
  try {
    const worker = await workerSvc.register(data);
    dispatch(registeredAction(worker));
  } catch (err) {
    dispatch(errorAction(`gagal mendaftarkan ${data.name}`));
  }
};

/**
 * action to remove a worker from database
 * @param id worker id
 */
export const remove = (id: number) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(loadingAction());
  try {
    await workerSvc.remove(id);
    dispatch(removedAction(id));
  } catch (err) {
    dispatch(errorAction('gagal menghapus pekerja'));
  }
};

/**
 * action to get list of worker
 * @param dispatch
 */
export const getList = async (dispatch: Dispatch): Promise<void> => {
  dispatch(loadingAction());
  try {
    const workers = await workerSvc.list();
    dispatch(workersLoadedAction(workers));
  } catch (err) {
    dispatch(errorAction('gagal memuat daftar pekerja'));
  }
};
