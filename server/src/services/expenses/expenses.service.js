// Initializes the `expenses` service on path `/api/expenses`
const createService = require('feathers-mongodb');
const hooks = require('./expenses.hooks');
const filters = require('./expenses.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/api/expenses', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/expenses');

  mongoClient.then(db => {
    service.Model = db.collection('expenses');
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
