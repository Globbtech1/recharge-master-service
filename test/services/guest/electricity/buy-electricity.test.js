const app = require('../../../../src/app');

describe('\'guest/electricity/buy-electricity\' service', () => {
  it('registered the service', () => {
    const service = app.service('guest/electricity/buy-electricity');
    expect(service).toBeTruthy();
  });
});
