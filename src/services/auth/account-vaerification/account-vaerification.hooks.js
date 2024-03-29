const {
  validateVerificationInput,
} = require("../../../hooks/email-verification");
const { SendGeneralResponse } = require("../../../hooks/general-uses");
const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [authenticate("jwt")],
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
