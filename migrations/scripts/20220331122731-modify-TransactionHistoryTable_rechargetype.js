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
      queryInterface.addColumn("transactions_history", "transactionType", {
        type: DataTypes.STRING,
        defaultValue: "",
      }),
      queryInterface.addColumn("transactions_history", "platform", {
        type: DataTypes.ENUM("web", "mobile", "schedule", "auto"),
        allowNull: true,
        defaultValue: "auto",
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
      queryInterface.removeColumn("transactions_history", "transactionType"),
      queryInterface.removeColumn("transactions_history", "platform"),
    ]);
  },
};
