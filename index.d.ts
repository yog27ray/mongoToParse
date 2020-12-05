import { MongoToParseError } from './src/error/mongo-to-parse-error';
import { MongoToParseQueryBase, RequestQueryPayload, RequestCountPayload } from './src/transform/mongo-to-parse-query-base';
declare class MongoToParseQuery extends MongoToParseQueryBase {
    initialize(applicationId: string, serverURL: string, config?: {
        masterKey?: string;
    }): void;
}
export { MongoToParseQuery, MongoToParseError, MongoToParseQueryBase, RequestQueryPayload, RequestCountPayload };
