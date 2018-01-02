const { authenticate } = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');
const Validator = require('../../libraries/Validator');

const { hashPassword } = require('feathers-authentication-local').hooks;
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: '_id'
  })
];

const fields = {
  'firstName': [],
  'lastName': [],
  'email': ['required', 'email'],
  'password': ['required'],
  'repeatPassword': ['required', {
    name: 'customValidator',
    customValidator(value, key, options, data) {
      if (value === data['password']) {
        return true;
      } else {
        return 'repeatPassword must be the same as password';
      }
    }
  }]
};

const validations = [
  commonHooks.pluck(...Object.keys(fields)),
  commonHooks.validate(formValues => {
    return Validator.validateInputs(formValues, fields);
  })
];

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ ...restrict ],
    create: [ ...validations, commonHooks.discard('repeatPassword'), hashPassword() ],
    update: [ ...restrict, ...validations, hashPassword() ],
    patch: [ ...restrict, hashPassword() ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard('password', 'repeatPassword')
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
