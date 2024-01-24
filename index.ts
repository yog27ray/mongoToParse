import { MongoToParseError } from './src/error/mongo-to-parse-error';
import { MongoToParseQueryBase, RequestCountPayload, RequestQueryPayload } from './src/transform/mongo-to-parse-query-base';

let ParseLib = Parse;

class MongoToParseQuery extends MongoToParseQueryBase {
  async initialize(
    applicationId: string,
    serverURL: string,
    config: { masterKey?: string, disableSingleInstance?: boolean } = {}): Promise<void> {
    const isNodeEnvironment = typeof process !== 'undefined';
    if (!isNodeEnvironment) {
      ParseLib = await import('parse');
    }
    if (typeof ParseLib === 'undefined') {
      ParseLib = await import('parse/node');
    }
    ParseLib.initialize(applicationId, undefined, config.masterKey);
    ParseLib.serverURL = serverURL;
    this.setParse(ParseLib);
    if (config.disableSingleInstance && (ParseLib.Object as unknown as { disableSingleInstance: () => void }).disableSingleInstance) {
      (ParseLib.Object as unknown as { disableSingleInstance: () => void }).disableSingleInstance();
    }
  }
}

export { MongoToParseQuery, MongoToParseError, MongoToParseQueryBase, RequestQueryPayload, RequestCountPayload };
