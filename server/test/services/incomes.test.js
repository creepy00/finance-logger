const assert = require('assert');
const app = require('../../src/app');

describe('\'incomes\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/incomes');

    assert.ok(service, 'Registered the service');
  });
});
