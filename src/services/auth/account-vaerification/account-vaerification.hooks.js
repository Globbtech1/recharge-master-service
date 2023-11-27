const {
  validateVerificationInput,
} = require("../../../hooks/email-verification");
const { SendGeneralResponse } = require("../../../hooks/general-uses");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validateVerificationInput()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      SendGeneralResponse({
        message: "Account verified successfully ",
      }),
    ],
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
