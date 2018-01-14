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
  }),
  hook => {
    hook.data.name = hook.data.name.trim();
    hook.data.type = hook.data.type.trim();

    return hook;
  }
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
    create: [ authenticate("jwt"), ...validations, addUser ],
    update: [...restrict, ...validations, addUser ],
    patch: [...restrict ],
    remove: [...restrict ]
  },

  after: {
    all: [],
    find: [
      (hook) => {
        return hook.service.Model.distinct("type", {
          userId: hook.params.user._id
        }).then(result => {
          hook.result.customTypes = result;

          return hook;
        });
      },
      // total expenses amount per user
      (hook) => {
        return new Promise((resolve, reject) => {
          hook.service.Model.aggregate([
            {
              $match: {
                userId: hook.params.user._id
              }
            },
            {
              $group: {
                _id: null,
                totalAmountUser: {
                  $sum: "$amount"
                },
              }
            }
          ], (err, result) => {
            if (err) {
              reject(err);
            } else {
              hook.result.totalAmountUser = result[0] ? result[0].totalAmountUser : 0;
              resolve(hook);
            }

            return hook;
          });
        });
      },
      // get total expenses per user per passed month and year
      (hook) => {
        return new Promise((resolve, reject) => {
          hook.service.Model.aggregate([
            {
              $match: {
                $and: [
                  { userId: hook.params.user._id },
                  { month: hook.params.query.month },
                  { year: hook.params.query.year }
                ]
              }
            },
            {
              $group: {
                _id: null,
                totalAmountUserMonth: {
                  $sum: "$amount"
                },
              }
            }
          ], (err, result) => {
            if (err) {
              reject(err);
            } else {
              hook.result.totalAmountUserMonth = result[0] ? result[0].totalAmountUserMonth : 0;
              resolve(hook);
            }
          });
        });
      }
    ],
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
