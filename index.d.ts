import { MongoToParseError } from './src/error/mongo-to-parse-error';
import { MongoToParseQueryBase, RequestCountPayload, RequestQueryPayload } from './src/transform/mongo-to-parse-query-base';
import { ParseClassExtender } from './src/transform/parse-class-extender';
import { ParseRoleExtender } from './src/transform/parse-role-extender';
declare class MongoToParseQuery extends MongoToParseQueryBase {
    constructor();
    initialize(applicationId: string, serverURL: string, config?: {
        masterKey?: string;
        disableSingleInstance?: boolean;
    }): Promise<void>;
}
export { MongoToParseQuery, MongoToParseError, MongoToParseQueryBase, ParseClassExtender, ParseRoleExtender, RequestQueryPayload, RequestCountPayload, };
