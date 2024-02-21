import { MongoToParseError } from './src/error/mongo-to-parse-error';
import { MongoToParseQueryBase, RequestCountPayload, RequestQueryPayload } from './src/transform/mongo-to-parse-query-base';
import { ParseInstallationExtender } from './src/transform/parse-installation-extender';
import { ParseObjectExtender } from './src/transform/parse-object-extender';
import { ParseRoleExtender } from './src/transform/parse-role-extender';
import { ParseSessionExtender } from './src/transform/parse-session-extender';
import { ParseUserExtender } from './src/transform/parse-user-extender';

let ParseLib;
let isParseServerLoaded = false;
try {
  ParseLib = Parse;
  isParseServerLoaded = true;
} catch (error) {
  if ((error as { message: string; }).message !== 'Parse is not defined') {
    throw error;
  }
}

function checkIsNodeEnvironment(): boolean {
  return ((typeof process) === 'object');
}

class MongoToParseQuery extends MongoToParseQueryBase {
  constructor() {
    super();
    const isNodeEnvironment = checkIsNodeEnvironment();
    if (isNodeEnvironment) {
      this.setParse(ParseLib);
    }
  }

  initialize(
    applicationId: string,
    serverURL: string,
    config: { masterKey?: string, disableSingleInstance?: boolean } = {}): void {
    const isNodeEnvironment = checkIsNodeEnvironment();
    if (isNodeEnvironment && isParseServerLoaded) {
      throw Error('Initialize is not required when parse-server is initialized.');
    }
    ParseLib = isNodeEnvironment
      // eslint-disable-next-line global-require
      ? require('parse/node')
      // eslint-disable-next-line global-require
      : require('parse');
    ParseLib.initialize(applicationId, undefined, config.masterKey);
    ParseLib.serverURL = serverURL;
    this.setParse(ParseLib);
    if (config.disableSingleInstance
      && (ParseLib.Object as unknown as { disableSingleInstance(): void }).disableSingleInstance) {
      (ParseLib.Object as unknown as { disableSingleInstance(): void }).disableSingleInstance();
    }
  }
}
export {
  MongoToParseQuery,
  MongoToParseError,
  MongoToParseQueryBase,
  ParseObjectExtender,
  ParseRoleExtender,
  ParseSessionExtender,
  ParseInstallationExtender,
  ParseUserExtender,
  RequestQueryPayload,
  RequestCountPayload,
};
