import { extension } from 'mime-types';
import { Client, ClientOptions } from 'minio';
import { Readable } from 'stream';

export const ERROR_REQUIRE_OBJECT_NAME = 'error wajib memasukan nama objek';
export const ERROR_FILE_NOT_FOUND = 'error file tidak ditemukan';

let client: Client;
let bucketname: string;

/**
 * connect to minio object storage service
 * will create bucket automatically
 * @param _bucketname bucket name
 * @param options additional storage client options
 */
export async function connect(
  _bucketname: string,
  options: ClientOptions
): Promise<void> {
  client = new Client({
    ...options,
    useSSL: false,
  });
  bucketname = _bucketname || 'photo';
  try {
    await client.makeBucket(bucketname, 'us-east-1');
  } catch (err) {
    if (err?.code === 'BucketAlreadyOwnedByYou') {
      return;
    }
    throw err;
  }
}

/**
 * create random name file
 * @param mimetype mime type
 */
export function randomFileName(mimetype: string): string {
  return (
    new Date().getTime() +
    '-' +
    Math.round(Math.random() * 1000) +
    '.' +
    extension(mimetype)
  );
}

/**
 * save file to bucket
 * @param file readable file stream
 * @param mimetype file mime type
 * @returns saved object name
 */
export function saveFile(file: Readable, mimetype: string): Promise<string> {
  const objectName = randomFileName(mimetype);
  return new Promise((resolve, reject) => {
    client.putObject(bucketname, objectName, file, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(objectName);
    });
  });
}

/**
 * read object from storage
 * @param objectName object name to read
 * @throws {@link ERROR_REQUIRE_OBJECT_NAME} when object name empty
 * @throws {@link ERROR_FILE_NOT_FOUND} when file not found
 */
export async function readFile(objectName: string): Promise<Readable> {
  if (!objectName?.length) {
    throw ERROR_REQUIRE_OBJECT_NAME;
  }
  try {
    await client.statObject(bucketname, objectName);
  } catch (err) {
    if (err?.code === 'NotFound') {
      throw ERROR_FILE_NOT_FOUND;
    }
    throw err;
  }
  return client.getObject(bucketname, objectName);
}
