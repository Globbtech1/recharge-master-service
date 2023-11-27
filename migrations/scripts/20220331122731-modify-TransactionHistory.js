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
      queryInterface
        .addColumn("transactions_history", "paidBy", {
          type: DataTypes.STRING,
          allowNull: false,
          default: "self",
        })
        .then(() => {
          return queryInterface.sequelize.query(
            "UPDATE `transactions_history` SET paidBy = 'self'"
          );
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
      queryInterface.removeColumn("transactions_history", "paidBy"),
    ]);
  },
};
