const app = require('../../../../src/app');

describe('\'guest/electricity/verify-meter-number\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/electricity/verify-meter-number');
    expect(service).toBeTruthy();
  });
});
