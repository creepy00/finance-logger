const { authenticate } = require("@feathersjs/authentication").hooks;
const { restrictToOwner } = require("feathers-authentication-hooks");
const commonHooks = require("feathers-hooks-common");
const Validator = require("../../libraries/Validator");

const restrict = [
  authenticate("jwt"),
  restrictToOwner({
    idField: "_id",
    ownerField: "userId"
  })
];

const fields = {
  "name": ["required"],
  "type": ["required"],
  "amount": ["required", "number"],
  "month": ["required", "number"],
  "year": ["required", "number"]
};

const validations = [
  commonHooks.pluck(...Object.keys(fields)),
  commonHooks.validate(formValues => {
    return Validator.validateInputs(formValues, fields);
  })
];

const addUser = hook => {
  hook.data.userId = hook.params.user._id;
  return hook;
};

module.exports = {
  before: {
    all: [  ],
    find: [ ...restrict ],
    get: [ ...restrict ],
    create: [...restrict, ...validations, addUser ],
    update: [...restrict, ...validations, addUser ],
    patch: [...restrict ],
    remove: [...restrict ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
