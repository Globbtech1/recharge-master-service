const app = require('../../../src/app');

describe('\'data/buyDataBundle\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/buy-data-bundle');
    expect(service).toBeTruthy();
  });
});
