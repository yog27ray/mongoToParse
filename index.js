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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseRoleExtender = exports.ParseClassExtender = exports.MongoToParseQueryBase = exports.MongoToParseError = exports.MongoToParseQuery = void 0;
const mongo_to_parse_error_1 = require("./src/error/mongo-to-parse-error");
Object.defineProperty(exports, "MongoToParseError", { enumerable: true, get: function () { return mongo_to_parse_error_1.MongoToParseError; } });
const mongo_to_parse_query_base_1 = require("./src/transform/mongo-to-parse-query-base");
Object.defineProperty(exports, "MongoToParseQueryBase", { enumerable: true, get: function () { return mongo_to_parse_query_base_1.MongoToParseQueryBase; } });
const parse_class_extender_1 = require("./src/transform/parse-class-extender");
Object.defineProperty(exports, "ParseClassExtender", { enumerable: true, get: function () { return parse_class_extender_1.ParseClassExtender; } });
const parse_role_extender_1 = require("./src/transform/parse-role-extender");
Object.defineProperty(exports, "ParseRoleExtender", { enumerable: true, get: function () { return parse_role_extender_1.ParseRoleExtender; } });
let ParseLib;
let isParseServerLoaded = false;
try {
    ParseLib = Parse;
    isParseServerLoaded = true;
}
catch (error) {
    if (error.message !== 'Parse is not defined') {
        throw error;
    }
}
function checkIsNodeEnvironment() {
    return ((typeof process) === 'object');
}
class MongoToParseQuery extends mongo_to_parse_query_base_1.MongoToParseQueryBase {
    constructor() {
        super();
        const isNodeEnvironment = checkIsNodeEnvironment();
        if (isNodeEnvironment) {
            this.setParse(ParseLib);
        }
    }
    async initialize(applicationId, serverURL, config = {}) {
        const isNodeEnvironment = checkIsNodeEnvironment();
        if (isNodeEnvironment && isParseServerLoaded) {
            throw Error('Initialize is not required when parse-server is initialized.');
        }
        ({ default: ParseLib } = await Promise.resolve(`${isNodeEnvironment ? 'parse/node' : 'parse'}`).then(s => __importStar(require(s))));
        ParseLib.initialize(applicationId, undefined, config.masterKey);
        ParseLib.serverURL = serverURL;
        this.setParse(ParseLib);
        if (config.disableSingleInstance
            && ParseLib.Object.disableSingleInstance) {
            ParseLib.Object.disableSingleInstance();
        }
    }
}
exports.MongoToParseQuery = MongoToParseQuery;
//# sourceMappingURL=index.js.map