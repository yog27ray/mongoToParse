import bodyParser from 'body-parser';
import debug from 'debug';
import express, { Express } from 'express';
import http from 'http';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ParseServer } from 'parse-server';
import { Env } from './test-env';

const log = debug('mongoToParse:Server');

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'text/plain' }));
app.use(bodyParser.json());
const server = http.createServer(app);

let mongoDBURI: string;
let client: MongoClient;
async function dropDB(): Promise<any> {
  log('>>>>>>>DropDB<<<<<<<<');
  if (!client) {
    client = new MongoClient(mongoDBURI);
    client = await client.connect();
  }
  return new Promise((resolve: (result: unknown) => void, reject: (error: unknown) => void) => {
    client.db('dev-test-inmemory').dropDatabase((error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

async function startMongoDB(): Promise<any> {
  const mongod = new MongoMemoryServer({ instance: { dbName: 'dev-test-inmemory', port: 27020 } });

  mongoDBURI = await mongod.getUri();

  log('MongoDB', mongoDBURI);
  const serverURL = `http://localhost:${Env.PORT}/api/parse`;
  Env.serverURL = serverURL;
  const api = new ParseServer({
    databaseURI: mongoDBURI, // Connection string for your MongoDB database
    appId: Env.appId,
    masterKey: Env.masterKey, // Keep this key secret!
    serverURL, // Don't forget to change to https if needed
  });

  // Serve the Parse API on the /parse URL prefix
  app.use('/api/parse', api);
  Parse.Cloud.define('validFunctionName', async () => Promise.resolve({}));
  log('Parse Server', '>>>>>>', serverURL);
}

startMongoDB()
  .catch((error: any) => {
    log('>>>>>>>>>>Enable to start MongoDB', error);
  });

server.listen(Env.PORT, '0.0.0.0', () => {
  log('Express server listening on %d, in test mode', Env.PORT);
});

// Expose app
export { app, dropDB };
