"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CureSkinError = exports.MongoToParseQuery = void 0;
const cure_skin_error_1 = require("./src/error/cure-skin-error");
Object.defineProperty(exports, "CureSkinError", { enumerable: true, get: function () { return cure_skin_error_1.CureSkinError; } });
const mongo_to_parse_query_base_1 = require("./src/transform/mongo-to-parse-query-base");
class MongoToParseQuery extends mongo_to_parse_query_base_1.MongoToParseQueryBase {
    constructor() {
        super(Parse);
    }
}
exports.MongoToParseQuery = MongoToParseQuery;
//# sourceMappingURL=server.js.map