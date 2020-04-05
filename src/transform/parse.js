"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-require-imports */
/* eslint-disable global-require */
if (typeof Parse === 'undefined' && typeof process === 'object') {
    require('parse-server');
}
const parse = typeof Parse === 'undefined' ? require('parse') : Parse;
exports.parse = parse;
//# sourceMappingURL=parse.js.map