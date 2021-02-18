import { IncomingMessage, ServerResponse } from 'http';
import Busboy from 'busboy';
import url from 'url';
import mime from 'mime-types';
import { Writable, Readable } from 'stream';
import {
  add,
  cancel,
  done,
  list,
  ERROR_TASK_DATA_INVALID,
  ERROR_TASK_NOT_FOUND,
  ERROR_TASK_ALREADY_DONE,
} from './task';
import { saveFile, readFile, ERROR_FILE_NOT_FOUND } from '../lib/storage';

/**
 * service to handle task addition
 * @param req
 * @param res
 */
export function addSvc(req: IncomingMessage, res: ServerResponse): void {
  const busboy = new Busboy({ headers: req.headers });

  const data = {
    job: '',
    assigneeId: 0,
    attachment: null,
  };

  let finished = false;

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 500;
      res.write('internal server error');
      res.end();
    }
  }

  busboy.on(
    'file',
    async (fieldname, file: Readable, filename, encoding, mimetype) => {
      switch (fieldname) {
        case 'attachment':
          try {
            data.attachment = await saveFile(file, mimetype);
          } catch (err) {
            abort();
          }
          if (!req.aborted && finished) {
            try {
              const task = await add(data);
              res.setHeader('content-type', 'application/json');
              res.write(JSON.stringify(task));
            } catch (err) {
              if (err === ERROR_TASK_DATA_INVALID) {
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
    switch (fieldname) {
      case 'job':
        data.job = val;
        break;
      case 'assignee_id':
        data.assigneeId = parseInt(val, 10);
        break;
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
 * service to handle task list endpoint
 * @param req
 * @param res
 */
export async function listSvc(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    const tasks = await list();
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(tasks));
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

/**
 * service to handle task done
 * @param req
 * @param res
 */
export async function doneSvc(
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
    const task = await done(parseInt(id as string, 10));
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.write(JSON.stringify(task));
    res.end();
  } catch (err) {
    if (err === ERROR_TASK_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      res.end();
      return;
    }
    if (err === ERROR_TASK_ALREADY_DONE) {
      res.statusCode = 403;
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
 * service to handle cancel request
 * @param req
 * @param res
 */
export async function cancelSvc(
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
    const task = await cancel(parseInt(id as string, 10));
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.write(JSON.stringify(task));
    res.end();
  } catch (err) {
    if (err === ERROR_TASK_NOT_FOUND) {
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
 * service to handle get attachment request
 * @param req
 * @param res
 */
export async function getAttachmentSvc(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const uri = url.parse(req.url, true);
  const objectName = uri.pathname.replace('/attachment/', '');
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
