const app = require('../../src/app');

describe('\'obafemitestingIntegartion\' service', () => {
  it('registered the service', () => {
    const service = app.service('obafemitesting-integartion');
    expect(service).toBeTruthy();
  });
});
