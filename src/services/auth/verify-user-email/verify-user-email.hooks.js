const { validateEmailInput } = require("../../../hooks/email-verification");
const { SendGeneralResponse } = require("../../../hooks/general-uses");
const proccessEmail = require("../../../hooks/proccess-email");

const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [validateEmailInput()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      // proccessEmail({ mailtype: "EmailVerification" }),
      SendGeneralResponse({
        message: "A confirmation link has been sent ",
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
