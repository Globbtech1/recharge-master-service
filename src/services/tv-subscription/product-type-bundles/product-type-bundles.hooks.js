const { authenticate } = require("@feathersjs/authentication").hooks;
const {
  validateTvProviderProductTypeInput,
} = require("../../../hooks/rule.validator");

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [validateTvProviderProductTypeInput()],
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
