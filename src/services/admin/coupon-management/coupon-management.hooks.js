const { generateCouponNumber } = require("../../../hooks/adminServices.hook");
const {
  validateAddNewCouponInput,
} = require("../../../hooks/rule.admin.validator");

const { authenticate } = require("@feathersjs/authentication").hooks;

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [generateCouponNumber(), validateAddNewCouponInput()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [
      // Add an 'after' hook for the 'find' method
      async (context) => {
        // Modify the result before sending it back
        context.result.data = modifyList(context.result.data);

        return context;
      },
    ],
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

function modifyList(data) {
  const modifiedData = data?.map((item) => {
    const today = new Date().getTime();
    const validityDate = new Date(item.validity).getTime();

    return {
      ...item,
      Unit: "N/A",
      status: validityDate >= today ? "Active" : "Inactive",
    };
  });

  return modifiedData;
}
