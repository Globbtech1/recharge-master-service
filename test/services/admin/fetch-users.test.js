const app = require('../../../src/app');

describe('\'admin/fetchUsers\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/fetch-users');
    expect(service).toBeTruthy();
  });
});
