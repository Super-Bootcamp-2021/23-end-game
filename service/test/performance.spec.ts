import waitOn from 'wait-on';
import { init } from '../src/main';
import * as kv from '../src/lib/kv';
import * as bus from '../src/lib/bus';
import * as server from '../src/performance/server';
import { config } from '../src/config';
import { requestJSON } from './lib/client';
import { Performance } from '../src/performance/performance';
import { delay } from './lib/utils';

const { performance } = config;

describe('performance service', () => {
  const baseUrl = `http://localhost:${performance.server.port}`;

  beforeAll(async () => {
    await init();
    server.run(performance.server.port, () => {
      kv.close();
      bus.close();
    });
    await waitOn({
      resources: [`tcp:localhost:${performance.server.port}`],
      timeout: 5000,
    });
  });

  afterAll(async () => {
    server.stop();
  });

  describe('summary', () => {
    it('should return performance summary', async () => {
      await kv.save('task.total', '5');
      await kv.save('task.done', '2');
      await kv.save('task.cancelled', '1');
      await kv.save('worker.total', '3');
      const data = await requestJSON<Performance>(`${baseUrl}/summary`);
      expect(data.total_task).toEqual(5);
      expect(data.task_done).toEqual(2);
      expect(data.task_cancelled).toEqual(1);
      expect(data.total_worker).toEqual(3);
    });
  });

  describe('aggregation', () => {
    beforeEach(async () => {
      await kv.save('task.total', '5');
      await kv.save('task.done', '2');
      await kv.save('task.cancelled', '1');
      await kv.save('worker.total', '3');
    });

    it('should increase task total when task.added published', async () => {
      bus.publish('task.added', {});
      await delay(100);
      const data = await requestJSON<Performance>(`${baseUrl}/summary`);
      expect(data.total_task).toEqual(6);
    });

    it('should increase task done when task.done published', async () => {
      bus.publish('task.done', {});
      await delay(100);
      const data = await requestJSON<Performance>(`${baseUrl}/summary`);
      expect(data.task_done).toEqual(3);
    });

    it('should increase task canceled when task.cancelled published', async () => {
      bus.publish('task.cancelled', {});
      await delay(100);
      const data = await requestJSON<Performance>(`${baseUrl}/summary`);
      expect(data.task_cancelled).toEqual(2);
    });

    it('should increase worker registered when worker.registered published', async () => {
      bus.publish('worker.registered', {});
      await delay(100);
      const data = await requestJSON<Performance>(`${baseUrl}/summary`);
      expect(data.total_worker).toEqual(4);
    });

    it('should decrease worker registered when worker.removed published', async () => {
      bus.publish('worker.removed', {});
      await delay(100);
      const data = await requestJSON<Performance>(`${baseUrl}/summary`);
      expect(data.total_worker).toEqual(2);
    });
  });
});
