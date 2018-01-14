const {authenticate} = require("@feathersjs/authentication").hooks;
const commonHooks = require("feathers-hooks-common");
const {restrictToOwner} = require("feathers-authentication-hooks");
const Validator = require("../../libraries/Validator");

const {hashPassword} = require("@feathersjs/authentication-local").hooks;
const restrict = [
  authenticate("jwt"),
  restrictToOwner({
    idField: "_id",
    ownerField: "_id"
  })
];

const fields = {
  "fullName": [],
  "email": ["required", "email", {
    name: "customValidator",
    customValidator(value, key, data, validationHelper) {
      if (validationHelper.foundEmails > 0) {
        return "Email address already exists";
      } else {
        return true;
      }
    }
  }],
  "password": ["required"],
  "repeatPassword": ["required", {
    name: "customValidator",
    customValidator(value, key, data) {
      if (value === data["password"]) {
        return true;
      } else {
        return "repeatPassword must be the same as password";
      }
    }
  }]
};

const validations = [
  commonHooks.pluck(...Object.keys(fields)),
  hook => {
    return hook.service.Model.count({
      email: hook.data.email
    }).then(userCount => {
      hook.validationHelper = {
        foundEmails: userCount
      };

      return hook;
    });
  },
  commonHooks.validate((formValues, hook) => {
    return Validator.validateInputs(formValues, fields, hook.validationHelper);
  })
];

module.exports = {
  before: {
    all: [],
    find: [...restrict],
    get: [...restrict],
    create: [...validations, commonHooks.discard("repeatPassword"), hashPassword()],
    update: [...restrict, ...validations, hashPassword()],
    patch: [...restrict, hashPassword()],
    remove: [...restrict]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard("password", "repeatPassword")
      )
    ],
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
