import { MongoToParseError } from './src/error/mongo-to-parse-error';
import { MongoToParseQueryBase, RequestCountPayload, RequestQueryPayload } from './src/transform/mongo-to-parse-query-base';
declare class MongoToParseQuery extends MongoToParseQueryBase {
    constructor();
    initialize(applicationId: string, serverURL: string, config?: {
        masterKey?: string;
        disableSingleInstance?: boolean;
    }): Promise<void>;
}
export { MongoToParseQuery, MongoToParseError, MongoToParseQueryBase, RequestQueryPayload, RequestCountPayload };
