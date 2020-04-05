/* tslint:disable:no-require-imports */
/* eslint-disable global-require */
// eslint-disable-next-line import/no-mutable-exports
let parse = Parse;

if (typeof process === 'undefined') {
  parse = require('parse');
}

export { parse };
