// Initializes the `users` service on path `/users`
const createService = require("feathers-mongodb");
const hooks = require("./users.hooks");

module.exports = function () {
  const app = this;
  const paginate = app.get("paginate");
  const mongoClient = app.get("mongoClient");
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use("/api/users", createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service("api/users");

  mongoClient.then(db => {
    service.Model = db.collection("users");
  });

  service.hooks(hooks);
};
