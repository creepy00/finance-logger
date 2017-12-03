// Initializes the `incomes` service on path `/api/incomes`
const createService = require('feathers-mongodb');
const hooks = require('./incomes.hooks');
const filters = require('./incomes.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/api/incomes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/incomes');

  mongoClient.then(db => {
    service.Model = db.collection('incomes');
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
