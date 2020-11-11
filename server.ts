import { CureSkinError } from './src/error/cure-skin-error';
import { MongoToParseQueryBase } from './src/transform/mongo-to-parse-query-base';

declare let Parse;
class MongoToParseQuery extends MongoToParseQueryBase {
  constructor() {
    super(Parse);
  }
}

export { MongoToParseQuery, CureSkinError };
