const app = require('../../../src/app');

describe('\'guest/guest-purchase\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/guest-purchase');
    expect(service).toBeTruthy();
  });
});
