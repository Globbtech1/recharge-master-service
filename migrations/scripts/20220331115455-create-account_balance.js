"use strict";
module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable("account_balance", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      balance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      ledgerBalance: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      cashBackBalance: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      isLocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    queryInterface.dropTable("account_balance"),
};
