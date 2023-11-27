const { CONSTANT } = require("../../dependency/Config");
const { validateTransactionPin } = require("../../hooks/billPayment.hook");
const { SendGeneralResponse } = require("../../hooks/general-uses");

const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [validateTransactionPin()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [SendGeneralResponse({ message: "Security pin is valid" })],
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
