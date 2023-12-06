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
      queryInterface.addColumn("users", "isAccountLocked", {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }),

      queryInterface.addColumn("users", "reasonForAccountLock", {
        type: DataTypes.STRING,
        allowNull: "",
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('transactions_history');
     */
    return Promise.all([
      queryInterface.removeColumn("users", "isAccountLocked"),
      queryInterface.removeColumn("users", "reasonForAccountLock"),
    ]);
  },
};
