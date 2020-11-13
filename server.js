"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoToParseQueryBase = exports.MongoToParseError = exports.MongoToParseQuery = void 0;
const mongo_to_parse_error_1 = require("./src/error/mongo-to-parse-error");
Object.defineProperty(exports, "MongoToParseError", { enumerable: true, get: function () { return mongo_to_parse_error_1.MongoToParseError; } });
const mongo_to_parse_query_base_1 = require("./src/transform/mongo-to-parse-query-base");
Object.defineProperty(exports, "MongoToParseQueryBase", { enumerable: true, get: function () { return mongo_to_parse_query_base_1.MongoToParseQueryBase; } });
class MongoToParseQuery extends mongo_to_parse_query_base_1.MongoToParseQueryBase {
    constructor() {
        super();
        this.setParse(Parse);
    }
}
exports.MongoToParseQuery = MongoToParseQuery;
//# sourceMappingURL=server.js.map