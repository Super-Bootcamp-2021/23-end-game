import { Worker } from '../worker/worker.model';
import http from 'http';
import { config } from '../config';

const { task } = config;

export const WORKER_HOST = task.workerBaseUrl;
export const ERROR_WORKER_NOT_FOUND = 'pekerja tidak ditemukan';

/**
 * get worker bv it's id
 * @param id worker id
 * @throws {@link ERROR_WORKER_NOT_FOUND} when worker not found
 */
export function info(id: number): Promise<Worker> {
  return new Promise((resolve, reject) => {
    const req = http.request(`${WORKER_HOST}/info?id=${id}`, (res) => {
      let data = '';
      if (res.statusCode === 404) {
        reject(ERROR_WORKER_NOT_FOUND);
      }
      res.on('data', (chunk) => {
        data += chunk.toString();
      });
      res.on('end', () => {
        const worker = JSON.parse(data);
        resolve(worker);
      });
      res.on('error', (err) => {
        reject(err?.message || err.toString());
      });
    });
    req.end();
  });
}
