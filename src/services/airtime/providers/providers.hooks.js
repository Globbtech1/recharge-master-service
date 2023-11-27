const { getAllProviders } = require("../../../hooks/billPayment.hook");
const { verifyRequestProvider } = require("../../../hooks/prepareTransaction");

const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [],
    // find: [getAllProviders(), verifyRequestProvider("airtime-purchase")],
    get: [],
    create: [authenticate("jwt")],
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
