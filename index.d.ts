import { MongoToParseError } from './src/error/mongo-to-parse-error';
import { MongoToParseQueryBase, RequestCountPayload, RequestQueryPayload } from './src/transform/mongo-to-parse-query-base';
import { ParseClassExtender, ParseObjectExtender } from './src/transform/parse-object-extender';
import { ParseRoleExtender } from './src/transform/parse-role-extender';
declare class MongoToParseQuery extends MongoToParseQueryBase {
    constructor();
    initialize(applicationId: string, serverURL: string, config?: {
        masterKey?: string;
        disableSingleInstance?: boolean;
    }): Promise<void>;
}
export { MongoToParseQuery, MongoToParseError, MongoToParseQueryBase, ParseObjectExtender, ParseClassExtender, ParseRoleExtender, RequestQueryPayload, RequestCountPayload, };
