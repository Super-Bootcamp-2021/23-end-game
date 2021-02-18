import { client } from '../lib/http-client';
import { SERVICE_BASEURL } from './config';
import { TaskData } from './reducer';

/**
 * task to input into database
 */
export interface NewTaskData {
  attachment: File;
  job: string;
  assignee_id: number;
}

/**
 * add new task
 * @param data task to be added
 */
export function add(data: NewTaskData): Promise<TaskData> {
  return client.post<TaskData>(`${SERVICE_BASEURL}/add`, data);
}

/**
 * get list of task on database
 */
export function list(): Promise<TaskData[]> {
  return client.get<TaskData[]>(`${SERVICE_BASEURL}/list`);
}

/**
 * cancel a task
 * @param id task id
 */
export function cancel(id: number): Promise<TaskData> {
  return client.put<TaskData>(`${SERVICE_BASEURL}/cancel?id=${id}`);
}

/**
 * mark task as done
 * @param id task id
 */
export function done(id: number): Promise<TaskData> {
  return client.put<TaskData>(`${SERVICE_BASEURL}/done?id=${id}`);
}
