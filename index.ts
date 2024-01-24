import { MongoToParseError } from './src/error/mongo-to-parse-error';
import { MongoToParseQueryBase, RequestCountPayload, RequestQueryPayload } from './src/transform/mongo-to-parse-query-base';

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

  async initialize(
    applicationId: string,
    serverURL: string,
    config: { masterKey?: string, disableSingleInstance?: boolean } = {}): Promise<void> {
    const isNodeEnvironment = checkIsNodeEnvironment();
    if (isNodeEnvironment && isParseServerLoaded) {
      throw Error('Initialize is not required when parse-server is initialized.');
    }
    ({ default: ParseLib } = await import(isNodeEnvironment ? 'parse/node' : 'parse'));
    ParseLib.initialize(applicationId, undefined, config.masterKey);
    ParseLib.serverURL = serverURL;
    this.setParse(ParseLib);
    if (config.disableSingleInstance
      && (ParseLib.Object as unknown as { disableSingleInstance(): void }).disableSingleInstance) {
      (ParseLib.Object as unknown as { disableSingleInstance(): void }).disableSingleInstance();
    }
  }
}

export { MongoToParseQuery, MongoToParseError, MongoToParseQueryBase, RequestQueryPayload, RequestCountPayload };
