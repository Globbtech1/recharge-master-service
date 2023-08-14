const {
  guestCustomerValidationInput,
} = require("../../../../hooks/rule.validator");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [guestCustomerValidationInput()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
