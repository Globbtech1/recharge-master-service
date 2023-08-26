const {
  checkForExistingValues,
  checkIfNotExisting,
} = require("../../hooks/general-uses");
const { validateAddProductListInput } = require("../../hooks/rule.validator");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      checkIfNotExisting({
        fieldsToCheck: [
          { fieldName: "id", value: "productId", friendlyName: "product id" },

          // Add more fields to check as needed
        ],
        serviceType: "products",
      }),
      checkForExistingValues({
        fieldsToCheck: [
          { fieldName: "productName", friendlyName: "product Name" },

          // Add more fields to check as needed
        ],
        serviceType: "product-list",
      }),

      validateAddProductListInput(),
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
