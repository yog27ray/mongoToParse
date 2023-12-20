import bodyParser from 'body-parser';
import express, { Express } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import { MongoClient } from 'mongodb';
import { ParseServer } from 'parse-server';
import * as process from 'process';
import rp from 'request-promise';
import { Env } from './test-env';

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'text/plain' }));
app.use(bodyParser.json());

let DB_NAME: string;
let mongoDBURI: string;
let client: MongoClient;
async function dropDB(): Promise<void> {
  if (!client) {
    client = new MongoClient(mongoDBURI);
    client = await client.connect();
  }
  await client.db(DB_NAME).dropDatabase();
}

async function startMongoDB(): Promise<any> {
  console.log('>>>starting<<<');
  mongoDBURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mongoToParse';
  DB_NAME = mongoDBURI.split('/').pop();
  console.log('mongoDBURI:', mongoDBURI);
  await dropDB();
  console.log('dbDrop complete');
  const serverURL = `http://localhost:${Env.PORT}/api/parse`;
  Env.serverURL = serverURL;
  console.log('server url', Env.serverURL);
  const api = new ParseServer({
    databaseURI: mongoDBURI, // Connection string for your MongoDB database
    appId: Env.appId,
    masterKey: Env.masterKey, // Keep this key secret!
    serverURL, // Don't forget to change to https if needed
  });
  await api.start();
  // Serve the Parse API on the /parse URL prefix
  app.use('/api/parse', api.app as RequestHandlerParams);
  Parse.Cloud.define('validFunctionName', async () => Promise.resolve({}));
}

async function wait(time = 100): Promise<void> {
  return new Promise((resolve: () => void) => {
    setTimeout(resolve, time);
  });
}

async function waitForServerToBoot(): Promise<any> {
  try {
    await rp('http://localhost:1234/api/parse/health');
  } catch (error) {
    await wait();
    console.log('error: ', (error as { message: string; }).message);
    await waitForServerToBoot();
  }
}

// tslint:disable-next-line
before(async function a() {
  this.timeout(50000);
  await startMongoDB();
  app.listen(Env.PORT, '::', () => {
    // eslint-disable-next-line no-console
    console.log('Express server listening on %d, in test mode', Env.PORT);
  });
  await waitForServerToBoot();
});

// Expose app
export { app, dropDB };
