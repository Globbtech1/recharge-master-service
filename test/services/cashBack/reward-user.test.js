const app = require('../../../src/app');

describe('\'cashBack/rewardUser\' service', () => {
  it('registered the service', () => {
    const service = app.service('cashBack/reward-user');
    expect(service).toBeTruthy();
  });
});
