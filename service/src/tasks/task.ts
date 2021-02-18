import { getConnection } from 'typeorm';
import { info as getWorkerInfo } from './worker.client';
import * as bus from '../lib/bus';
import { Task } from './task.model';

export const ERROR_TASK_DATA_INVALID = 'data pekerjaan baru tidak lengkap';
export const ERROR_TASK_NOT_FOUND = 'pekerjaan tidak ditemukan';
export const ERROR_TASK_ALREADY_DONE = 'pekerjaan sudah selesai';

/**
 * task information
 */
export interface TaskData {
  job: string;
  assigneeId: number;
  attachment: string;
}

/**
 * add new task
 * @param data task information
 * @throws {@link ERROR_TASK_DATA_INVALID} when task information incomplete
 * @throws {@link ERROR_WORKER_NOT_FOUND} when worker not found
 */
export async function add(data: TaskData): Promise<Task> {
  if (!data.job || !data.assigneeId) {
    throw ERROR_TASK_DATA_INVALID;
  }
  await getWorkerInfo(data.assigneeId);
  const taskRepo = getConnection().getRepository<Task>('Task');
  const newTask = await taskRepo.save({
    job: data.job,
    assignee: { id: data.assigneeId },
    attachment: data.attachment,
  });
  const task = await taskRepo.findOne(newTask.id, { relations: ['assignee'] });
  if (!task) {
    throw ERROR_TASK_NOT_FOUND;
  }
  bus.publish('task.added', task);
  return task;
}

/**
 * mark task as done
 * @param id task id
 * @throws {@link ERROR_TASK_NOT_FOUND} when task not found
 * @throws {@link ERROR_TASK_ALREADY_DONE} when task already done
 */
export async function done(id: number): Promise<Task> {
  const taskRepo = getConnection().getRepository<Task>('Task');
  const task = await taskRepo.findOne(id, { relations: ['assignee'] });
  if (!task || task?.cancelled) {
    throw ERROR_TASK_NOT_FOUND;
  }
  if (task.done) {
    throw ERROR_TASK_ALREADY_DONE;
  }
  task.done = true;
  await taskRepo.save(task);
  bus.publish('task.done', task);
  return task;
}

/**
 * cancel a task
 * @param id task id
 * @throws {@link ERROR_TASK_NOT_FOUND} when task not found
 */
export async function cancel(id: number): Promise<Task> {
  const taskRepo = getConnection().getRepository<Task>('Task');
  const task = await taskRepo.findOne(id, { relations: ['assignee'] });
  if (!task || task?.cancelled) {
    throw ERROR_TASK_NOT_FOUND;
  }
  task.cancelled = true;
  await taskRepo.save(task);
  bus.publish('task.cancelled', task);
  return task;
}

/**
 * get curretn list of task
 */
export function list(): Promise<Task[]> {
  const taskRepo = getConnection().getRepository<Task>('Task');
  return taskRepo.find({ relations: ['assignee'] });
}
