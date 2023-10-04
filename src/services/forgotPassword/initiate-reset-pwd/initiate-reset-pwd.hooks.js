const {
  sendInitiatePasswordResetEmail,
} = require("../../../hooks/email-service.hook");
const { SendGeneralResponse } = require("../../../hooks/general-uses");
const proccessEmail = require("../../../hooks/proccess-email");
const { InitiateResetPassword } = require("../../../hooks/userManagement.hook");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [InitiateResetPassword()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      // proccessEmail({ mailtype: "resetEmail" })
      sendInitiatePasswordResetEmail(),
      SendGeneralResponse({ message: "Reset link sent successfully" }),
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
