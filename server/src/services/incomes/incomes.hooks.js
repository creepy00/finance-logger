const { authenticate } = require('feathers-authentication').hooks;
const { restrictToOwner } = require('feathers-authentication-hooks');
const commonHooks = require('feathers-hooks-common');
const Validator = require('../../libraries/Validator');

const fields = {
  'name': ['required'],
  'type': ['required'],
  'amount': ['required', 'number'],
  'month': ['required', 'number'],
  'year': ['required', 'number']
};

const validations = [
  commonHooks.pluck(...Object.keys(fields)),
  commonHooks.validate(formValues => {
    return Validator.validateInputs(formValues, fields);
  })
];

const addUser = hook => {
  console.log(hook.user);
  // hook.data.userId = hook.user._id;
};

const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: 'userId'
  })
];

module.exports = {
  before: {
    all: [ ...restrict ],
    find: [addUser],
    get: [],
    create: [ ...validations ],
    update: [ ...validations ],
    patch: [],
    remove: []
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
