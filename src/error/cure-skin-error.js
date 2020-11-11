"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CureSkinError = void 0;
class CureSkinError extends Error {
    constructor(error) {
        super(error.message);
        Object.setPrototypeOf(this, CureSkinError.prototype);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CureSkinError);
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
exports.CureSkinError = CureSkinError;
//# sourceMappingURL=cure-skin-error.js.map