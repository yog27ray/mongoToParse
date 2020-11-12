import { MongoToParseError } from './src/error/mongo-to-parse-error';
import { MongoToParseQueryBase, ParseClassExtender } from './src/transform/mongo-to-parse-query-base';

declare let Parse;
class MongoToParseQuery extends MongoToParseQueryBase {
  constructor() {
    super(Parse);
  }
}

export { MongoToParseQuery, MongoToParseError, ParseClassExtender };
