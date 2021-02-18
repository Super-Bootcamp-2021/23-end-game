import { connect as natsConnect, Client, ClientOpts } from 'nats';

let client: Client;

/**
 * connect to message bus
 * @param url nats url
 * @param config nats additional configuration
 */
export function connect(url: string, config?: ClientOpts): Promise<null> {
  return new Promise((resolve, reject) => {
    client = natsConnect(url, config);
    client.on('connect', () => {
      resolve(null);
    });
    client.on('error', (err: Error) => {
      reject(err);
    });
  });
}

/**
 * publish a topic with a payload
 * @param subject
 * @param data
 */
export function publish(subject: string, data: { [key: string]: any }): void {
  client.publish(subject, JSON.stringify(data));
}

/**
 * subscribe a topic
 * @param subject
 * @param callback
 */
export function subscribe(subject: string, callback: Function): number {
  return client.subscribe(subject, callback);
}

/**
 * unsubscribe
 * @param sid subscription id
 */
export function unsubscribe(sid: number): void {
  return client.unsubscribe(sid);
}

/**
 * close connection
 */
export function close(): void {
  if (!client) {
    return;
  }
  client.close();
}
