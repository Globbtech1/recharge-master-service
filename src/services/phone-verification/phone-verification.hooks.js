const { sendVerificationSMS, validatePhoneNumberInput } = require("../../hooks/phone-verification");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validatePhoneNumberInput(), sendVerificationSMS()],
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
