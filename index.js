"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoToParseQueryBase = exports.MongoToParseError = exports.MongoToParseQuery = void 0;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const parse_1 = require("parse");
const mongo_to_parse_error_1 = require("./src/error/mongo-to-parse-error");
Object.defineProperty(exports, "MongoToParseError", { enumerable: true, get: function () { return mongo_to_parse_error_1.MongoToParseError; } });
const mongo_to_parse_query_base_1 = require("./src/transform/mongo-to-parse-query-base");
Object.defineProperty(exports, "MongoToParseQueryBase", { enumerable: true, get: function () { return mongo_to_parse_query_base_1.MongoToParseQueryBase; } });
class MongoToParseQuery extends mongo_to_parse_query_base_1.MongoToParseQueryBase {
    initialize(applicationId, serverURL, config = {}) {
        parse_1.Parse.initialize(applicationId, undefined, config.masterKey);
        parse_1.Parse.serverURL = serverURL;
        this.setParse(parse_1.Parse);
        if (config.disableSingleInstance) {
            parse_1.Parse.Object.disableSingleInstance();
        }
    }
}
exports.MongoToParseQuery = MongoToParseQuery;
//# sourceMappingURL=index.js.map