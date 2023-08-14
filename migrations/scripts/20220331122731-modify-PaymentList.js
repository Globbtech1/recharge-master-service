"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      // queryInterface.addColumn("payment_list", "cashBackPercentage", {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   default: 1,
      // }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('payment_list');
     */
    return Promise.all([
      // queryInterface.removeColumn("payment_list", "cashBackPercentage"),
    ]);
  },
};
