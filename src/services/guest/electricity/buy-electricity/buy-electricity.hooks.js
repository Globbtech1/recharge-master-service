const { validateMobileNumber } = require("../../../../hooks/billPayment.hook");
const {
  validateBuyElectricityGuestInput,
} = require("../../../../hooks/rule.validator");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validateBuyElectricityGuestInput(),validateMobileNumber()],
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
