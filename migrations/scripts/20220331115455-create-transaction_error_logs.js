"use strict";

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable("transaction_error_logs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      amount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },

      error: {
        type: DataTypes.STRING(1234),
        allowNull: true,
      },
      userData: {
        type: DataTypes.STRING(1234),
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      deletedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
    }),
  down: (queryInterface /* , Sequelize */) =>
    queryInterface.dropTable("transaction_error_logs"),
};
