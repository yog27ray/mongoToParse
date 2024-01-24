"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropDB = exports.app = void 0;
/* eslint-disable no-console */
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const parse_server_1 = require("parse-server");
const process = __importStar(require("process"));
const request_promise_1 = __importDefault(require("request-promise"));
const test_env_1 = require("./test-env");
const app = (0, express_1.default)();
exports.app = app;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json({ type: 'text/plain' }));
app.use(body_parser_1.default.json());
let DB_NAME;
let mongoDBURI;
let client;
async function dropDB() {
    if (!client) {
        client = new mongodb_1.MongoClient(mongoDBURI);
        client = await client.connect();
    }
    await client.db(DB_NAME).dropDatabase();
}
exports.dropDB = dropDB;
async function startMongoDB() {
    console.log('>>>starting<<<');
    mongoDBURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mongoToParse';
    DB_NAME = mongoDBURI.split('/').pop();
    console.log('mongoDBURI:', mongoDBURI);
    await dropDB();
    console.log('dbDrop complete');
    const serverURL = `http://localhost:${test_env_1.Env.PORT}/api/parse`;
    test_env_1.Env.serverURL = serverURL;
    console.log('server url', test_env_1.Env.serverURL);
    const api = new parse_server_1.ParseServer({
        databaseURI: mongoDBURI, // Connection string for your MongoDB database
        appId: test_env_1.Env.appId,
        masterKey: test_env_1.Env.masterKey, // Keep this key secret!
        serverURL, // Don't forget to change to https if needed
    });
    await api.start();
    // Serve the Parse API on the /parse URL prefix
    app.use('/api/parse', api.app);
    Parse.Cloud.define('validFunctionName', async () => Promise.resolve({}));
}
async function wait(time = 100) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
async function waitForServerToBoot() {
    try {
        await (0, request_promise_1.default)('http://localhost:1234/api/parse/health');
    }
    catch (error) {
        await wait();
        console.log('error: ', error.message);
        await waitForServerToBoot();
    }
}
// tslint:disable-next-line
before(async function a() {
    this.timeout(50000);
    await startMongoDB();
    app.listen(test_env_1.Env.PORT, '::', () => {
        // eslint-disable-next-line no-console
        console.log('Express server listening on %d, in test mode', test_env_1.Env.PORT);
    });
    await waitForServerToBoot();
});
//# sourceMappingURL=setup-server.js.map