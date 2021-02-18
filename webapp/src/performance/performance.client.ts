import { client } from '../lib/http-client';
import { SERVICE_BASEURL } from './config';
import { PerformanceSummary } from './reducer';

/**
 * get current performance summary
 */
export function summary(): Promise<PerformanceSummary> {
  return client.get<PerformanceSummary>(`${SERVICE_BASEURL}/summary`);
}
