/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Parse } from 'parse';
import { MongoToParseError } from './src/error/mongo-to-parse-error';
import { MongoToParseQueryBase } from './src/transform/mongo-to-parse-query-base';

class MongoToParseQuery extends MongoToParseQueryBase {
  constructor(applicationId: string, serverURL: string, config: { masterKey?: string } = {}) {
    Parse.initialize(applicationId, undefined, config.masterKey);
    Parse.serverURL = serverURL;
    super(Parse);
  }
}

export { MongoToParseQuery, MongoToParseError };
