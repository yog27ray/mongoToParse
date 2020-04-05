"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const debug_1 = __importDefault(require("debug"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongodb_1 = require("mongodb");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const parse_server_1 = require("parse-server");
const test_env_1 = require("./test-env");
const log = debug_1.default('mongoToParse:Server');
const app = express_1.default();
exports.app = app;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json({ type: 'text/plain' }));
app.use(body_parser_1.default.json());
const server = http_1.default.createServer(app);
let mongoDBURI;
let client;
async function dropDB() {
    log('>>>>>>>DropDB<<<<<<<<');
    if (!client) {
        client = new mongodb_1.MongoClient(mongoDBURI);
        client = await client.connect();
    }
    return new Promise((resolve, reject) => {
        client.db('dev-test-inmemory').dropDatabase((error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}
exports.dropDB = dropDB;
async function startMongoDB() {
    const mongod = new mongodb_memory_server_1.MongoMemoryServer({ instance: { dbName: 'dev-test-inmemory', port: 27020 } });
    mongoDBURI = await mongod.getUri();
    log('MongoDB', mongoDBURI);
    const serverURL = `http://localhost:${test_env_1.Env.PORT}/api/parse`;
    const api = new parse_server_1.ParseServer({
        databaseURI: mongoDBURI,
        appId: 'myAppId',
        masterKey: 'myMasterKey',
        serverURL,
    });
    // Serve the Parse API on the /parse URL prefix
    app.use('/api/parse', api);
    log('Parse Server', '>>>>>>', serverURL);
}
startMongoDB()
    .catch((error) => log('>>>>>>>>>>Enable to start MongoDB', error));
server.listen(test_env_1.Env.PORT, '0.0.0.0', () => {
    log('Express server listening on %d, in test mode', test_env_1.Env.PORT);
});
//# sourceMappingURL=setup.js.map