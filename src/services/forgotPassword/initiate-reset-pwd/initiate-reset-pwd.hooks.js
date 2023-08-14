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
    create: [proccessEmail({ mailtype: "resetEmail" })],
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
