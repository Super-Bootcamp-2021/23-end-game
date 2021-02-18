import { read, save } from '../lib/kv';

const TASK_TOTAL_KEY = 'task.total';
const TASK_DONE_KEY = 'task.done';
const TASK_CANCELLED_KEY = 'task.cancelled';
const WORKER_TOTAL_KEY = 'worker.total';

export interface Performance {
  total_task: number;
  task_done: number;
  task_cancelled: number;
  total_worker: number;
}

/**
 * return summary of current performance
 */
export async function summary(): Promise<Performance> {
  const data = {
    total_task: parseInt((await read(TASK_TOTAL_KEY)) || '0', 10),
    task_done: parseInt((await read(TASK_DONE_KEY)) || '0', 10),
    task_cancelled: parseInt((await read(TASK_CANCELLED_KEY)) || '0', 10),
    total_worker: parseInt((await read(WORKER_TOTAL_KEY)) || '0', 10),
  };
  return data;
}

/**
 * increase total task
 */
export async function increaseTotalTask(): Promise<void> {
  const raw = await read(TASK_TOTAL_KEY);
  let val = parseInt(raw || '0', 10);
  val++;
  await save(TASK_TOTAL_KEY, val.toString());
}

/**
 * increase task done
 */
export async function increaseDoneTask(): Promise<void> {
  const raw = await read(TASK_DONE_KEY);
  let val = parseInt(raw || '0', 10);
  val++;
  await save(TASK_DONE_KEY, val.toString());
}

/**
 * increase cancelled task
 */
export async function increaseCancelledTask(): Promise<void> {
  const raw = await read(TASK_CANCELLED_KEY);
  let val = parseInt(raw || '0', 10);
  val++;
  await save(TASK_CANCELLED_KEY, val.toString());
}

/**
 * increase total worker
 */
export async function increaseTotalWorker(): Promise<void> {
  const raw = await read(WORKER_TOTAL_KEY);
  let val = parseInt(raw || '0', 10);
  val++;
  await save(WORKER_TOTAL_KEY, val.toString());
}

/**
 * decrease total worker
 */
export async function decreaseTotalWorker(): Promise<void> {
  const raw = await read(WORKER_TOTAL_KEY);
  let val = parseInt(raw || '0', 10);
  if (val > 0) {
    val--;
  }
  await save(WORKER_TOTAL_KEY, val.toString());
}
