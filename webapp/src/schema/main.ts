import SwaggerUI from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';
import {
  WORKER_SERVICE_BASEURL,
  TASK_SERVICE_BASEURL,
  PERFORMANCE_SERVICE_BASEURL,
} from './config';
import tasksSchema from '../../../schema/tasks.yaml';
import performanceSchema from '../../../schema/performance.yaml';
import workerSchema from '../../../schema/worker.yaml';

workerSchema.host = new URL(WORKER_SERVICE_BASEURL).host;
tasksSchema.host = new URL(TASK_SERVICE_BASEURL).host;
performanceSchema.host = new URL(PERFORMANCE_SERVICE_BASEURL).host;

SwaggerUI({
  spec: workerSchema,
  dom_id: '#worker',
});

SwaggerUI({
  spec: tasksSchema,
  dom_id: '#tasks',
});

SwaggerUI({
  spec: performanceSchema,
  dom_id: '#performance',
});
