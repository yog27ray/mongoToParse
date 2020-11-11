import Parse from 'parse/node';
import { MongoToParseError } from './src/error/cure-skin-error';
import { MongoToParseQueryBase } from './src/transform/mongo-to-parse-query-base';

class MongoToParseQuery extends MongoToParseQueryBase {
  constructor() {
    super(Parse);
  }
}

export { MongoToParseQuery, MongoToParseError };
