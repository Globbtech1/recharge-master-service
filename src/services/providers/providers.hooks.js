const { checkForExistingValues } = require("../../hooks/general-uses");
const { validateAddProviderInput } = require("../../hooks/rule.validator");

const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [
      validateAddProviderInput(),
      checkForExistingValues({
        fieldsToCheck: [
          { fieldName: "productName", friendlyName: "product Name" },
          { fieldName: "slug", friendlyName: "product slug" },

          // Add more fields to check as needed
        ],
        serviceType: "providers",
      }),
    ],
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
