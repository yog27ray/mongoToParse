/* tslint:disable:no-require-imports */
/* eslint-disable global-require */
if (typeof Parse === 'undefined' && typeof process === 'object') {
  require('parse-server');
}
const parse = typeof Parse === 'undefined' ? require('parse') : Parse;

export { parse };
