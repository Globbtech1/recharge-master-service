"use strict";

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable("transactions_history", {
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
      paymentType: {
        type: DataTypes.ENUM("debit", "credit"),
        allowNull: false,
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
      referenceNumber: {
        type: DataTypes.STRING(1234),
        allowNull: true,
      },
      metaData: {
        type: DataTypes.STRING(1234),
        allowNull: true,
      },
      paymentListId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transactionDate: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      transactionStatus: {
        type: DataTypes.ENUM("Failed", "Successful"),
        allowNull: false,
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
    queryInterface.dropTable("transactions_history"),
};
