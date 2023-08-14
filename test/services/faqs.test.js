const app = require('../../src/app');

describe('\'faqs\' service', () => {
  it('registered the service', () => {
    const service = app.service('faqs');
    expect(service).toBeTruthy();
  });
});
