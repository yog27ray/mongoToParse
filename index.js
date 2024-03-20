"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseUserExtender = exports.ParseInstallationExtender = exports.ParseSessionExtender = exports.ParseSchemaExtender = exports.ParseRoleExtender = exports.ParseObjectExtender = exports.MongoToParseQueryBase = exports.MongoToParseError = exports.MongoToParseQuery = void 0;
const parse_1 = __importDefault(require("parse"));
const mongo_to_parse_error_1 = require("./src/error/mongo-to-parse-error");
Object.defineProperty(exports, "MongoToParseError", { enumerable: true, get: function () { return mongo_to_parse_error_1.MongoToParseError; } });
const mongo_to_parse_query_base_1 = require("./src/transform/mongo-to-parse-query-base");
Object.defineProperty(exports, "MongoToParseQueryBase", { enumerable: true, get: function () { return mongo_to_parse_query_base_1.MongoToParseQueryBase; } });
const parse_installation_extender_1 = require("./src/transform/parse-installation-extender");
Object.defineProperty(exports, "ParseInstallationExtender", { enumerable: true, get: function () { return parse_installation_extender_1.ParseInstallationExtender; } });
const parse_object_extender_1 = require("./src/transform/parse-object-extender");
Object.defineProperty(exports, "ParseObjectExtender", { enumerable: true, get: function () { return parse_object_extender_1.ParseObjectExtender; } });
const parse_role_extender_1 = require("./src/transform/parse-role-extender");
Object.defineProperty(exports, "ParseRoleExtender", { enumerable: true, get: function () { return parse_role_extender_1.ParseRoleExtender; } });
const parse_schema_extender_1 = require("./src/transform/parse-schema-extender");
Object.defineProperty(exports, "ParseSchemaExtender", { enumerable: true, get: function () { return parse_schema_extender_1.ParseSchemaExtender; } });
const parse_session_extender_1 = require("./src/transform/parse-session-extender");
Object.defineProperty(exports, "ParseSessionExtender", { enumerable: true, get: function () { return parse_session_extender_1.ParseSessionExtender; } });
const parse_user_extender_1 = require("./src/transform/parse-user-extender");
Object.defineProperty(exports, "ParseUserExtender", { enumerable: true, get: function () { return parse_user_extender_1.ParseUserExtender; } });
class MongoToParseQuery extends mongo_to_parse_query_base_1.MongoToParseQueryBase {
    initialize(applicationId, serverURL, config = {}) {
        parse_1.default.initialize(applicationId, undefined, config.masterKey);
        parse_1.default.serverURL = serverURL;
        this.setParse(parse_1.default);
        if (config.disableSingleInstance
            && parse_1.default.Object.disableSingleInstance) {
            parse_1.default.Object.disableSingleInstance();
        }
    }
}
exports.MongoToParseQuery = MongoToParseQuery;
//# sourceMappingURL=index.js.map