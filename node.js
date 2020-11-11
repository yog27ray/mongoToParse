"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CureSkinError = exports.MongoToParseQuery = void 0;
const node_1 = __importDefault(require("parse/node"));
const cure_skin_error_1 = require("./src/error/cure-skin-error");
Object.defineProperty(exports, "CureSkinError", { enumerable: true, get: function () { return cure_skin_error_1.CureSkinError; } });
const mongo_to_parse_query_base_1 = require("./src/transform/mongo-to-parse-query-base");
class MongoToParseQuery extends mongo_to_parse_query_base_1.MongoToParseQueryBase {
    constructor() {
        super(node_1.default);
    }
}
exports.MongoToParseQuery = MongoToParseQuery;
//# sourceMappingURL=node.js.map