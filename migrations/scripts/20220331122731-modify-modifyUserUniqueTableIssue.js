"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("users", "email");
    await queryInterface.removeIndex("users", "phoneNumber");
    await queryInterface.addIndex("users", ["email", "deletedAt"], {
      unique: true,
    });
    await queryInterface.addIndex("users", ["phoneNumber", "deletedAt"], {
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("users", ["email", "deletedAt"]);
    await queryInterface.removeIndex("users", ["phoneNumber", "deletedAt"]);
    await queryInterface.addIndex("users", "email", { unique: true });
    await queryInterface.addIndex("users", "phoneNumber", { unique: true });
  },
};
