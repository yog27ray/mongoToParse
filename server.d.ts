import { MongoToParseError } from './src/error/mongo-to-parse-error';
import { MongoToParseQueryBase, ParseObjectAfterDeleteRequest, ParseObjectAfterFindRequest, ParseObjectAfterLoginRequest, ParseObjectAfterSaveRequest, ParseObjectBeforeDeleteRequest, ParseObjectBeforeFindRequest, ParseObjectBeforeLoginRequest, ParseObjectBeforeSaveRequest, RequestCountPayload, RequestQueryPayload } from './src/transform/mongo-to-parse-query-base';
import { ParseInstallationExtender } from './src/transform/parse-installation-extender';
import { ParseObjectExtender } from './src/transform/parse-object-extender';
import { ParseRoleExtender } from './src/transform/parse-role-extender';
import { ParseSchemaExtender } from './src/transform/parse-schema-extender';
import { ParseSessionExtender } from './src/transform/parse-session-extender';
import { ParseUserExtender } from './src/transform/parse-user-extender';
declare class MongoToParseQuery extends MongoToParseQueryBase {
    constructor();
}
export { MongoToParseQuery, MongoToParseError, MongoToParseQueryBase, ParseObjectAfterDeleteRequest, ParseObjectAfterFindRequest, ParseObjectAfterLoginRequest, ParseObjectAfterSaveRequest, ParseObjectBeforeDeleteRequest, ParseObjectBeforeFindRequest, ParseObjectBeforeLoginRequest, ParseObjectBeforeSaveRequest, ParseObjectExtender, ParseRoleExtender, ParseSchemaExtender, ParseSessionExtender, ParseInstallationExtender, ParseUserExtender, RequestQueryPayload, RequestCountPayload, };
