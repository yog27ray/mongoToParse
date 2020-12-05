// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Parse } from 'parse';
import { MongoToParseError } from './src/error/mongo-to-parse-error';
import { MongoToParseQueryBase, RequestQueryPayload, RequestCountPayload } from './src/transform/mongo-to-parse-query-base';

class MongoToParseQuery extends MongoToParseQueryBase {
  initialize(applicationId: string, serverURL: string, config: { masterKey?: string, disableSingleInstance?: boolean } = {}): void {
    Parse.initialize(applicationId, undefined, config.masterKey);
    Parse.serverURL = serverURL;
    this.setParse(Parse);
    if (config.disableSingleInstance) {
      Parse.Object.disableSingleInstance();
    }
  }
}

export { MongoToParseQuery, MongoToParseError, MongoToParseQueryBase, RequestQueryPayload, RequestCountPayload };
