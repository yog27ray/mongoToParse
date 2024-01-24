"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const test_env_1 = require("./test-env");
before(() => {
    console.log('>>>starting<<<');
    test_env_1.Env.serverURL = `http://localhost:${test_env_1.Env.PORT}/api/parse`;
    console.log('server url', test_env_1.Env.serverURL);
});
//# sourceMappingURL=setup-node.js.map