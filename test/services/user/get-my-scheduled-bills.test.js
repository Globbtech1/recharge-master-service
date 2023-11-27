const app = require('../../../src/app');

describe('\'user/getMyScheduledBills\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/get-my-scheduled-bills');
    expect(service).toBeTruthy();
  });
});
