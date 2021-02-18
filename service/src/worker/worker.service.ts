import { IncomingMessage, ServerResponse } from 'http';
import Busboy from 'busboy';
import url from 'url';
import mime from 'mime-types';
import { Writable, Readable } from 'stream';
import {
  register,
  list,
  remove,
  info,
  ERROR_REGISTER_DATA_INVALID,
  ERROR_WORKER_NOT_FOUND,
} from './worker';
import { saveFile, readFile, ERROR_FILE_NOT_FOUND } from '../lib/storage';

/**
 * service to handle worker registration
 * @param req
 * @param res
 */
export function registerSvc(req: IncomingMessage, res: ServerResponse): void {
  const busboy = new Busboy({ headers: req.headers });

  const data = {
    name: '',
    age: 0,
    bio: '',
    address: '',
    photo: '',
  };

  let finished = false;

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      res.end();
    }
  }

  busboy.on(
    'file',
    async (fieldname, file: Readable, filename, encoding, mimetype) => {
      switch (fieldname) {
        case 'photo':
          try {
            data.photo = await saveFile(file, mimetype);
          } catch (err) {
            abort();
          }
          if (!req.aborted && finished) {
            try {
              const worker = await register(data);
              res.setHeader('content-type', 'application/json');
              res.write(JSON.stringify(worker));
            } catch (err) {
              if (err === ERROR_REGISTER_DATA_INVALID) {
                res.statusCode = 401;
              } else {
                res.statusCode = 500;
              }
              res.write(err);
            }
            res.end();
          }
          break;
        default: {
          const noop = new Writable({
            write(chunk, encding, callback) {
              setImmediate(callback);
            },
          });
          file.pipe(noop);
        }
      }
    }
  );

  busboy.on('field', (fieldname, val) => {
    if (['name', 'age', 'bio', 'address'].includes(fieldname)) {
      data[fieldname] = val;
    }
  });

  busboy.on('finish', async () => {
    finished = true;
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

/**
 * service to handle worker list endpoint
 * @param req
 * @param res
 */
export async function listSvc(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    const workers = await list();
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(workers));
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

/**
 * service to handle info request
 * @param req
 * @param res
 */
export async function infoSvc(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const uri = url.parse(req.url, true);
  const id = uri.query['id'];
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    const worker = await info(parseInt(id as string, 10));
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(worker));
    res.end();
  } catch (err) {
    if (err === ERROR_WORKER_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      res.end();
      return;
    }
    res.statusCode = 500;
    res.end();
    return;
  }
}

/**
 * service to handle remove request
 * @param req
 * @param res
 */
export async function removeSvc(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const uri = url.parse(req.url, true);
  const id = uri.query['id'];
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    const worker = await remove(parseInt(id as string, 10));
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.write(JSON.stringify(worker));
    res.end();
  } catch (err) {
    if (err === ERROR_WORKER_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      res.end();
      return;
    }
    res.statusCode = 500;
    res.end();
    return;
  }
}

/**
 * service to handle get photo request
 * @param req
 * @param res
 */
export async function getPhotoSvc(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const uri = url.parse(req.url, true);
  const objectName = uri.pathname.replace('/photo/', '');
  if (!objectName) {
    res.statusCode = 400;
    res.write('request tidak sesuai');
    res.end();
  }
  try {
    const objectRead = await readFile(objectName);
    res.setHeader('Content-Type', mime.lookup(objectName) as string);
    res.statusCode = 200;
    objectRead.pipe(res);
  } catch (err) {
    if (err === ERROR_FILE_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      res.end();
      return;
    }
    res.statusCode = 500;
    res.write('gagal membaca file');
    res.end();
    return;
  }
}
