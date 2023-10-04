const { prepareEmailTemplate } = require("../../../hooks/email-service.hook");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [prepareEmailTemplate()],
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
