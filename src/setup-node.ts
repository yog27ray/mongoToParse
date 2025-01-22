import { Env } from './test-env';

before(() => {
  console.log('>>>starting<<<');
  Env.serverURL = `http://localhost:${Env.PORT}/api/parse`;
  console.log('server url', Env.serverURL);
});
