import { Context, APIGatewayEvent } from 'aws-lambda';
const awsServerlessExpress = require(process.env.NODE_ENV === 'test'
  ? '../../index'
  : 'aws-serverless-express');
import app from './app';
import MongoService from './lib/mongodb';

let conn = null;

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below, then redeploy (`npm run package-deploy`)
const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'font/eot',
  'font/opentype',
  'font/otf',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml',
];
const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

export const handler = (event: APIGatewayEvent, context: Context) => {
  // We add this so we can re-use `client` between function calls.
  context.callbackWaitsForEmptyEventLoop = false;
  // Because `client` is in the global scope, Lambda may retain it between
  // function calls thanks to `callbackWaitsForEmptyEventLoop`.
  // This means your Lambda function doesn't have to go through the
  // potentially expensive process of connecting to Redis every time.
  if (!conn) {
    MongoService.getConnection().then((connection) => {
      conn = connection;
      awsServerlessExpress.proxy(server, event, context);
    });
  }
};
