"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropDB = exports.app = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongodb_1 = require("mongodb");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const parse_server_1 = require("parse-server");
const request_promise_1 = __importDefault(require("request-promise"));
const test_env_1 = require("./test-env");
const app = (0, express_1.default)();
exports.app = app;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json({ type: 'text/plain' }));
app.use(body_parser_1.default.json());
let mongoDBURI;
let client;
async function dropDB() {
    if (!client) {
        client = new mongodb_1.MongoClient(mongoDBURI);
        client = await client.connect();
    }
    await client.db('dev-test-inmemory').dropDatabase();
}
exports.dropDB = dropDB;
async function startMongoDB() {
    const mongod = await mongodb_memory_server_1.MongoMemoryServer.create({ instance: { dbName: 'dev-test-inmemory', port: 27020 } });
    mongoDBURI = `${mongod.getUri()}dev-test-inmemory`;
    const serverURL = `http://localhost:${test_env_1.Env.PORT}/api/parse`;
    test_env_1.Env.serverURL = serverURL;
    const api = new parse_server_1.ParseServer({
        databaseURI: mongoDBURI,
        appId: test_env_1.Env.appId,
        masterKey: test_env_1.Env.masterKey,
        serverURL, // Don't forget to change to https if needed
    });
    // Serve the Parse API on the /parse URL prefix
    app.use('/api/parse', api);
    Parse.Cloud.define('validFunctionName', async () => Promise.resolve({}));
}
async function waitForServerToBoot() {
    try {
        await (0, request_promise_1.default)('http://localhost:1234/api/parse/health');
    }
    catch (error) {
        await waitForServerToBoot();
    }
}
// tslint:disable-next-line
before(async function () {
    this.timeout(50000);
    await startMongoDB();
    const server = http_1.default.createServer(app);
    server.listen(test_env_1.Env.PORT, '0.0.0.0', () => {
        // eslint-disable-next-line no-console
        console.log('Express server listening on %d, in test mode', test_env_1.Env.PORT);
    });
    await waitForServerToBoot();
});
//# sourceMappingURL=setup.js.map