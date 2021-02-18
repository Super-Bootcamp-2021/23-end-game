import { ClientOpts, createClient, RedisClient } from 'redis';
import { promisify } from 'util';

let client: RedisClient;

/**
 * connect to redis service
 * @param options connection options
 */
export function connect(options?: ClientOpts): Promise<null> {
  return new Promise((resolve, reject) => {
    client = createClient({
      ...options,
      port: parseInt(options.port.toString(), 10),
    });
    client.on('connect', () => {
      resolve(null);
    });
    client.on('error', (err: Error) => {
      reject(err);
    });
  });
}

/**
 * save data to a db
 * @param db
 * @param data
 */
export function save(db: string, data: string): Promise<void> {
  const setAsync = promisify(client.set).bind(client);
  return setAsync(db, data);
}

/**
 * read data from a db
 * @param db
 */
export async function read(db: string): Promise<string> {
  const getAsync = promisify(client.get).bind(client);
  return getAsync(db);
}

/**
 * remove a database
 * @param db
 */
export function drop(db: string): Promise<void> {
  const delAsync = promisify(client.del).bind(client);
  return delAsync(db);
}

/**
 * close client connection
 */
export function close(): void {
  if (!client) {
    return;
  }
  if (client.connected) {
    client.end(true);
  }
}
