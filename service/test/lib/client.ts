import http, { RequestOptions } from 'http';
import { URL } from 'url';

/**
 * make http request
 * @param options request options
 */
export function requestJSON<T>(
  options: string | RequestOptions | URL
): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk.toString();
      });
      res.on('end', () => {
        const data = JSON.parse(body);
        resolve(data as T);
      });
      res.on('error', (err) => {
        reject(err?.message || err.toString());
      });
    });
    req.on('error', (err) => {
      reject(err?.message || err.toString());
    });
    req.end();
  });
}
