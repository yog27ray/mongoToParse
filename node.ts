import Parse from 'parse/node';
import { MongoToParseError } from './src/error/mongo-to-parse-error';
import {
  MongoToParseQueryBase,
  RequestCountPayload,
  RequestQueryPayload
} from './src/transform/mongo-to-parse-query-base';
import { ParseInstallationExtender } from './src/transform/parse-installation-extender';
import { ParseObjectExtender } from './src/transform/parse-object-extender';
import { ParseRoleExtender } from './src/transform/parse-role-extender';
import { ParseSchemaExtender } from './src/transform/parse-schema-extender';
import { ParseSessionExtender } from './src/transform/parse-session-extender';
import { ParseUserExtender } from './src/transform/parse-user-extender';

class MongoToParseQuery extends MongoToParseQueryBase {
  initialize(
    applicationId: string,
    serverURL: string,
    config: { masterKey?: string, disableSingleInstance?: boolean } = {}): void {
    Parse.initialize(applicationId, undefined, config.masterKey);
    Parse.serverURL = serverURL;
    this.setParse(Parse);
    if (config.disableSingleInstance
      && (Parse.Object as unknown as { disableSingleInstance(): void }).disableSingleInstance) {
      (Parse.Object as unknown as { disableSingleInstance(): void }).disableSingleInstance();
    }
  }
}

export {
  MongoToParseQuery,
  MongoToParseError,
  MongoToParseQueryBase,
  ParseObjectExtender,
  ParseRoleExtender,
  ParseSchemaExtender,
  ParseSessionExtender,
  ParseInstallationExtender,
  ParseUserExtender,
  RequestQueryPayload,
  RequestCountPayload,
};
