const {
  validateGuestTvProviderProductTypeInput,
} = require("../../../../hooks/rule.validator");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validateGuestTvProviderProductTypeInput()],
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
