const app = require('../../../src/app');

describe('\'user/deleteSchedulePayment\' service', () => {
  it('registered the service', () => {
    const service = app.service('user/delete-schedule-payment');
    expect(service).toBeTruthy();
  });
});
