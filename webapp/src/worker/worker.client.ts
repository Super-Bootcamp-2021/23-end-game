import { client } from '../lib/http-client';
import { SERVICE_BASEURL } from './config';
import { Worker } from './reducer';

/**
 * data to input new worker
 */
export interface WorkerData {
  name: string;
  age: string;
  photo: File;
  bio: string;
  address: string;
}

/**
 * register new worker
 * @param data worker information
 */
export function register(data: WorkerData): Promise<Worker> {
  return client.post<Worker>(`${SERVICE_BASEURL}/register`, data);
}

/**
 * get registered workers
 */
export function list(): Promise<Worker[]> {
  return client.get<Worker[]>(`${SERVICE_BASEURL}/list`);
}

/**
 * remove a worker
 * @param id worker id
 */
export function remove(id: number): Promise<Worker> {
  return client.del<Worker>(`${SERVICE_BASEURL}/remove?id=${id}`);
}

/**
 * get worker informations
 * @param id worker id
 */
export function info(id: number): Promise<Worker> {
  return client.get(`${SERVICE_BASEURL}/info?id=${id}`);
}
