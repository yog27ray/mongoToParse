import { MongoToParseError } from './src/error/mongo-to-parse-error';
import {
  MongoToParseQueryBase,
  RequestCountPayload,
  RequestQueryPayload,
} from './src/transform/mongo-to-parse-query-base';
import { ParseClassExtender } from './src/transform/parse-class-extender';

class MongoToParseQuery extends MongoToParseQueryBase {
  constructor() {
    super();
    this.setParse(Parse);
  }
}

export { MongoToParseQuery, MongoToParseError, ParseClassExtender, MongoToParseQueryBase, RequestQueryPayload, RequestCountPayload };
