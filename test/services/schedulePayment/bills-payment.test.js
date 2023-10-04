const app = require('../../../src/app');

describe('\'schedulePayment/billsPayment\' service', () => {
  it('registered the service', () => {
    const service = app.service('schedulePayment/bills-payment');
    expect(service).toBeTruthy();
  });
});
