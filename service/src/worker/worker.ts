import { getConnection } from 'typeorm';
import { Worker } from './worker.model';
import * as bus from '../lib/bus';

export const ERROR_REGISTER_DATA_INVALID =
  'data registrasi pekerja tidak lengkap';
export const ERROR_WORKER_NOT_FOUND = 'tidak ditemukan';

/**
 * worker data types
 */
export interface WorkerData {
  name: string;
  age: number;
  bio: string;
  address: string;
  photo: string;
}

/**
 * register new worker
 * @param data new worker information
 * @throws {@link ERROR_REGISTER_DATA_INVALID} when registration data incomplete
 */
export async function register(data: WorkerData): Promise<Worker> {
  if (!data.name || !data.age || !data.bio || !data.address || !data.photo) {
    throw ERROR_REGISTER_DATA_INVALID;
  }
  const workerRepo = getConnection().getRepository<Worker>('Worker');
  const worker = new Worker();
  worker.name = data.name;
  worker.age = parseInt(data.age.toString(), 10);
  worker.bio = data.bio;
  worker.address = data.address;
  worker.photo = data.photo;
  await workerRepo.save(worker);
  bus.publish('worker.registered', worker);
  return worker;
}

/**
 * get list of worker
 */
export function list(): Promise<Worker[]> {
  const workerRepo = getConnection().getRepository<Worker>('Worker');
  return workerRepo.find();
}

/**
 * get detail worker information
 * @param id worker id
 * @throws {@link ERROR_WORKER_NOT_FOUND} when worker with this id not found
 */
export async function info(id: number): Promise<Worker> {
  const workerRepo = getConnection().getRepository<Worker>('Worker');
  const worker = await workerRepo.findOne(id);
  if (!worker) {
    throw ERROR_WORKER_NOT_FOUND;
  }
  return worker;
}

/**
 * remove a worker
 * @param id worker id
 * @throws {@link ERROR_WORKER_NOT_FOUND} when worker with this id not found
 */
export async function remove(id: number): Promise<Worker> {
  const workerRepo = getConnection().getRepository<Worker>('Worker');
  const worker = await workerRepo.findOne(id);
  if (!worker) {
    throw ERROR_WORKER_NOT_FOUND;
  }
  await workerRepo.delete(id);
  bus.publish('worker.removed', worker);
  return worker;
}
