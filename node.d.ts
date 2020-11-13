import { MongoToParseError } from './src/error/mongo-to-parse-error';
import { MongoToParseQueryBase } from './src/transform/mongo-to-parse-query-base';
declare class MongoToParseQuery extends MongoToParseQueryBase {
    constructor(applicationId: string, serverURL: string, config?: {
        masterKey?: string;
    });
}
export { MongoToParseQuery, MongoToParseError, MongoToParseQueryBase };
