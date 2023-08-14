const app = require('../../../../src/app');

describe('\'guest/data/buy-data\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/data/buy-data');
    expect(service).toBeTruthy();
  });
});
