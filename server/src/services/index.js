const users = require('./users/users.service.js');
const incomes = require('./incomes/incomes.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(incomes);
};
