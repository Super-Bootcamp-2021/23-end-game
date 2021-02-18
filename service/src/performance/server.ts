import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import { stdout } from 'process';
import { summarySvc } from './performance.service';
import * as agg from './performance.agg';

let server: Server;

/**
 * run server
 * @param port port to listen to
 * @param callback called when server stop
 */
export function run(port: number, callback?: () => void | Promise<void>): void {
  server = createServer((req, res) => {
    // cors
    const aborted = cors(req, res);
    if (aborted) {
      return;
    }

    function respond(statusCode = 200, message = '') {
      res.statusCode = statusCode;
      res.write(message);
      res.end();
    }

    try {
      const uri = url.parse(req.url, true);
      switch (uri.pathname) {
        case '/summary':
          if (req.method === 'GET') {
            return summarySvc(req, res);
          } else {
            respond(404);
          }
          break;
        default:
          respond(404);
      }
    } catch (err) {
      respond(500, 'unkown server error');
    }
  });

  // run aggregation
  agg.run();

  // stop handler
  server.on('close', () => {
    agg.stop();
    if (callback) {
      callback();
    }
  });

  // run server
  server.listen(port, () => {
    stdout.write(`🚀 performance service listening on port ${port}\n`);
  });
}

/**
 * middleware to handle browser CORS features
 * @param req
 * @param res
 */
export function cors(
  req: IncomingMessage,
  res: ServerResponse
): boolean | void {
  // handle preflight request
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }
}

/**
 * stop server
 */
export function stop(): void {
  if (server) {
    server.close();
  }
}
