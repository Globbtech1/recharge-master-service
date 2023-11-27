"use strict";

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable("payment_providers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      paymentListId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cashBackPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 1,
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
    queryInterface.dropTable("payment_providers"),
};
