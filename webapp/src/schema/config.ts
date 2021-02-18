/**
 * worker service base url
 */
export const WORKER_SERVICE_BASEURL =
  process.env['WORKER_SERVICE_BASEURL'] ?? 'http://localhost:7001';

/**
 * task service base url
 */
export const TASK_SERVICE_BASEURL =
  process.env['TASK_SERVICE_BASEURL'] ?? 'http://localhost:7002';

/**
 * performance service base url
 */
export const PERFORMANCE_SERVICE_BASEURL =
  process.env['PERFORMANCE_SERVICE_BASEURL'] ?? 'http://localhost:7003';
