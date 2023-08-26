const { checkForExistingValues } = require("../../hooks/general-uses");
const { validateAddProductInput } = require("../../hooks/rule.validator");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      checkForExistingValues({
        fieldsToCheck: [
          { fieldName: "productName", friendlyName: "product Name" },

          // Add more fields to check as needed
        ],
        serviceType: "products",
      }),
      validateAddProductInput(),
    ],
    update: [],
    patch: [
      // checkForExistingValues({
      //   fieldsToCheck: [
      //     { fieldName: "productName", friendlyName: "product Name" },
      //     // Add more fields to check as needed
      //   ],
      //   serviceType: "products",
      // }),
    ],
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
