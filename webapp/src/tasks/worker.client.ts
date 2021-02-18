import { client } from '../lib/http-client';
import { WORKER_SERVICE_BASEURL } from './config';
import { WorkerData } from './reducer';

/**
 * get list of worker
 */
export function list(): Promise<WorkerData[]> {
  return client.get<WorkerData[]>(`${WORKER_SERVICE_BASEURL}/list`);
}
