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
      queryInterface.addColumn("users", "isEmailVerify", {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }),
      queryInterface.addColumn("users", "isPhoneNumberVerify", {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }),
      queryInterface.addColumn("users", "address", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("users", "localGovernment", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("users", "city", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("users", "state", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("users", "country", {
        type: DataTypes.STRING,
        allowNull: true,
      }),

      queryInterface.addColumn("users", "dateOfBirth", {
        type: DataTypes.DATE,
        allowNull: true,
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
      queryInterface.removeColumn("users", "isEmailVerify"),
      queryInterface.removeColumn("users", "isPhoneNumberVerify"),
      queryInterface.removeColumn("users", "address"),
      queryInterface.removeColumn("users", "localGovernment"),
      queryInterface.removeColumn("users", "city"),
      queryInterface.removeColumn("users", "state"),
      queryInterface.removeColumn("users", "country"),
      queryInterface.removeColumn("users", "dateOfBirth"),
    ]);
  },
};
