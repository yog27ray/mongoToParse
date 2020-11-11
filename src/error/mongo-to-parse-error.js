"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoToParseError = void 0;
class MongoToParseError extends Error {
    constructor(error) {
        super(error.message);
        Object.setPrototypeOf(this, MongoToParseError.prototype);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MongoToParseError);
        }
        this.name = error.type;
        this.code = error.code;
        this.type = error.type;
        this.params = error.params;
        this.logMessage = error.logMessage;
        this.skipSentry = error.skipSentry;
    }
    toJSON() {
        const jsonObj = { code: this.code, type: this.type, message: this.message };
        ['logMessage', 'skipSentry', 'params'].forEach((key) => {
            if (!this[key]) {
                return;
            }
            jsonObj[key] = this[key];
        });
        return jsonObj;
    }
}
exports.MongoToParseError = MongoToParseError;
//# sourceMappingURL=mongo-to-parse-error.js.map