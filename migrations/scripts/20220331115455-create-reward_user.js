"use strict";

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable("reward_user", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      amountBefore: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      amountAfter: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      cashBackAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      paymentListId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transactionsHistoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      metaData: {
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
    queryInterface.dropTable("reward_user"),
};
