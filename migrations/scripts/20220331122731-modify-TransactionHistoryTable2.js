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
      queryInterface.addColumn("transactions_history", "amountPaid", {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      }),
      queryInterface.addColumn("transactions_history", "paymentMethod", {
        type: DataTypes.ENUM("wallet", "paystack", "others"),
        allowNull: false,
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
      queryInterface.removeColumn("transactions_history", "amountPaid"),
      queryInterface.removeColumn("transactions_history", "paymentMethod"),
    ]);
  },
};
