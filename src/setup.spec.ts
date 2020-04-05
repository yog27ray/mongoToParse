import rp from 'request-promise';

async function waitForServerToBoot(): Promise<any> {
  try {
    await rp('http://localhost:1234/api/parse/health');
  } catch (error) {
    await waitForServerToBoot();
  }
}

describe('Server', () => {
  it('should respond to /', async () => {
    await waitForServerToBoot();
  });
});
