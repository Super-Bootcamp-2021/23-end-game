import {
  createConnection,
  EntitySchema,
  ConnectionOptions,
  Connection,
} from 'typeorm';

/**
 * connect to SQL database
 * @param entities schema entitites
 * @param config additinal orm configs
 */
export function connect(
  // eslint-disable-next-line @typescript-eslint/ban-types
  entities: Array<EntitySchema | Function>,
  config: ConnectionOptions
): Promise<Connection> {
  return createConnection({
    ...config,
    synchronize: true,
    entities,
  });
}
