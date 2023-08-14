const { authenticate } = require("@feathersjs/authentication").hooks;
const { setField } = require("feathers-authentication-hooks");
const { FormatResponseProfile } = require("../../hooks/userManagement.hook");
const { hashPassword, protect } =
  require("@feathersjs/authentication-local").hooks;
module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [
      authenticate("jwt"),
      setField({
        from: "params.user.id",
        as: "params.query.id",
      }),
    ],
    get: [
      setField({
        from: "params.user.id",
        as: "params.query.id",
      }),
    ],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [
      protect("id"),
      protect("password"),
      protect("deviceId"),
      protect("fcmToken"),
      protect("isVerify"),
    ],
    find: [],
    get: [
      // FormatResponseProfile()
    ],
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
