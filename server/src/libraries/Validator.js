const validationRulesHandlers = {
  required(value, key, {errorText = undefined}) {
    if (value) {
      return true;
    } else {
      return typeof errorText === 'string' ? errorText : `'${key}' is missing.`;
    }
  },
  number(value, key, {errorText = undefined}) {
    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    if (!!value && isNumeric(value)) {
      return true;
    } else {
      return typeof errorText === 'string' ? errorText : `'${key}' must be number.`;
    }
  },
  url(value, key, {errorText = undefined}) {
    const urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    const regex = new RegExp(urlRegex, '');

    if (typeof value === 'string' && value.match(regex)) {
      return true;
    } else {
      return typeof errorText === 'string' ? errorText : `'${key}' must be valid url.`;
    }
  },
  email(value, key, {errorText = undefined}) {
    const expression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regex = new RegExp(expression);

    if (typeof value === 'string' && value.match(regex)) {
      return true;
    } else {
      return typeof errorText === 'string' ? errorText : `'${key}' must be valid email.`;
    }
  },
  uuid(value, key, {errorText = undefined}) {
    const expression = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const regex = new RegExp(expression);

    if (typeof value === 'string' && value.match(regex)) {
      return true;
    } else {
      return typeof errorText === 'string' ? errorText : `'${key}' must be valid UUID.`;
    }
  }
};

function isEmpty(value) {
  return (typeof value === 'string' && value.length === 0) || typeof value === 'undefined' || value === null;
}

// if value is empty then dont validate unless it is required
function skipCheck(rule, value) {
  return (rule !== 'required' && isEmpty(value)) || (typeof validationRulesHandlers[rule] !== 'function' && rule !== 'customValidator');
}

const Validator = {
  validateInputs(data, validationRules) {
    const validationFields = Object.keys(validationRules);

    return validationFields.reduce((carry, key) => {
      const rules = validationRules[key];
      const value = data[key];

      const errors = rules.reduce((carry, rule) => {
        if (typeof rule === 'string') {
          if (!skipCheck(rule, value)) {
            const error = validationRulesHandlers[rule](value, key, {});
            if (typeof error === 'string') {
              return [...carry, error];
            }
          }

        } else if (typeof rule === 'object') {
          if (!skipCheck(rule.name, value)) {
            const validator = typeof rule.customValidator === 'function'
              ? rule.customValidator : validationRulesHandlers[rule.name];

            const error = validator(value, key, rule.options || {}, data);
            if (typeof error === 'string') {
              return [...carry, error];
            }
          }
        }

        return carry;
      }, []);

      if (errors.length) {
        carry[key] = errors;
      }

      return carry;
    }, {});
  }
};

module.exports = Object.freeze(Validator);