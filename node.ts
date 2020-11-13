import Parse from 'parse/node';
import { MongoToParseError } from './src/error/mongo-to-parse-error';
import { MongoToParseQueryBase } from './src/transform/mongo-to-parse-query-base';

class MongoToParseQuery extends MongoToParseQueryBase {
  constructor(applicationId: string, serverURL: string, config: { masterKey?: string } = {}) {
    Parse.initialize(applicationId, undefined, config.masterKey);
    Parse.serverURL = serverURL;
    super();
    this.setParse(Parse);
  }
}

export { MongoToParseQuery, MongoToParseError };
