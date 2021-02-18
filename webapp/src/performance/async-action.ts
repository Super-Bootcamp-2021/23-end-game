import { loadingAction, errorAction, summaryLoadedAction } from './store';
import { summary as perfSummary } from './performance.client';
import { Dispatch } from '@reduxjs/toolkit';

export const FAILED_TO_LOAD_PERFORMANCE = 'gagal memuat informasi kinerja';

/**
 * async action to get summary of current performance
 * @param dispatch action dispatcher
 */
export async function summary(dispatch: Dispatch): Promise<void> {
  dispatch(loadingAction());
  try {
    const summary = await perfSummary();
    dispatch(summaryLoadedAction(summary));
  } catch (err) {
    dispatch(errorAction(FAILED_TO_LOAD_PERFORMANCE));
  }
}
