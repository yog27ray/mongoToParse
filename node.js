"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoToParseError = exports.MongoToParseQuery = void 0;
const node_1 = __importDefault(require("parse/node"));
const mongo_to_parse_error_1 = require("./src/error/mongo-to-parse-error");
Object.defineProperty(exports, "MongoToParseError", { enumerable: true, get: function () { return mongo_to_parse_error_1.MongoToParseError; } });
const mongo_to_parse_query_base_1 = require("./src/transform/mongo-to-parse-query-base");
class MongoToParseQuery extends mongo_to_parse_query_base_1.MongoToParseQueryBase {
    constructor(applicationId, serverURL, config = {}) {
        node_1.default.initialize(applicationId, undefined, config.masterKey);
        node_1.default.serverURL = serverURL;
        super();
        this.setParse(node_1.default);
    }
}
exports.MongoToParseQuery = MongoToParseQuery;
//# sourceMappingURL=node.js.map