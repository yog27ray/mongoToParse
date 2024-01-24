/* eslint-disable no-console */
import bodyParser from 'body-parser';
import express, { Express } from 'express';
import { MongoClient } from 'mongodb';
import * as process from 'process';
import rp from 'request-promise';
import { Env } from './test-env';

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'text/plain' }));
app.use(bodyParser.json());

before(() => {
  console.log('>>>starting<<<');
  Env.serverURL = `http://localhost:${Env.PORT}/api/parse`;
  console.log('server url', Env.serverURL);
});

// Expose app
export { app };
