import bodyParser from 'body-parser';
import express, { Express } from 'express';
import http from 'http';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ParseServer } from 'parse-server';
import rp from 'request-promise';
import { Env } from './test-env';

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'text/plain' }));
app.use(bodyParser.json());

let mongoDBURI: string;
let client: MongoClient;
async function dropDB(): Promise<void> {
  if (!client) {
    client = new MongoClient(mongoDBURI);
    client = await client.connect();
  }
  await client.db('dev-test-inmemory').dropDatabase();
}

async function startMongoDB(): Promise<any> {
  const mongod = await MongoMemoryServer.create({ instance: { dbName: 'dev-test-inmemory', port: 27020 } });

  mongoDBURI = `${mongod.getUri()}dev-test-inmemory`;

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
}

async function waitForServerToBoot(): Promise<any> {
  try {
    await rp('http://localhost:1234/api/parse/health');
  } catch (error) {
    await waitForServerToBoot();
  }
}

// tslint:disable-next-line
before(async function () {
  this.timeout(50000);
  await startMongoDB();
  const server = http.createServer(app);
  server.listen(Env.PORT, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log('Express server listening on %d, in test mode', Env.PORT);
  });
  await waitForServerToBoot();
});

// Expose app
export { app, dropDB };
