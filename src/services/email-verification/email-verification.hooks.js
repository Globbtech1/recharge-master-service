const { sendVerificationEmail, validateEmailInput } = require("../../hooks/email-verification");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validateEmailInput(), sendVerificationEmail()],
    update: [],
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
