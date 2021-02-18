import * as orm from './lib/orm';
import * as storage from './lib/storage';
import * as kv from './lib/kv';
import * as bus from './lib/bus';
import { Task } from './tasks/task.model';
import { Worker } from './worker/worker.model';
import * as workerServer from './worker/server';
import * as tasksServer from './tasks/server';
import * as performanceServer from './performance/server';
import { config } from './config';

const { postgres, minio, nats, redis, performance, worker, task } = config;

/**
 * intitate database and service connection
 */
async function init(): Promise<void> {
  try {
    console.log('connect to database');
    await orm.connect([Worker, Task], {
      type: 'postgres',
      ...postgres,
    });
    console.log('database connected');
  } catch (err) {
    console.error('database connection failed');
    console.error(err);
    process.exit(1);
  }
  try {
    console.log('connect to object storage');
    await storage.connect('task-manager', minio);
    console.log('object storage connected');
  } catch (err) {
    console.error('object storage connection failed');
    console.error(err);
    process.exit(1);
  }
  try {
    console.log('connect to message bus');
    await bus.connect(nats.url);
    console.log('message bus connected');
  } catch (err) {
    console.error('message bus connection failed');
    console.error(err);
    process.exit(1);
  }
  try {
    console.log('connect to key value store');
    await kv.connect(redis);
    console.log('key value store connected');
  } catch (err) {
    console.error('key value store connection failed');
    console.error(err);
    process.exit(1);
  }
}

/**
 * close bus & kv connection when server stop working
 */
async function onStop() {
  bus.close();
  kv.close();
}

/**
 * application main routine
 * @param command command argument, only allow task, worker or performance
 */
async function main(command: string): Promise<void> {
  switch (command) {
    case 'performance':
      await init();
      performanceServer.run(performance.server.port, onStop);
      break;
    case 'task':
      await init();
      tasksServer.run(task.server.port, onStop);
      break;
    case 'worker':
      await init();
      workerServer.run(worker.server.port, onStop);
      break;
    default:
      console.log(`${command} tidak dikenali`);
      console.log('command yang valid: task, worker, performance');
  }
}

main(process.argv[2]);
