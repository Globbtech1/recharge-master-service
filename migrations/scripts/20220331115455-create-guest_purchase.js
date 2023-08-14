"use strict";

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable("guest_purchases", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      referenceNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      monnifyReference: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      metaData: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      paymentListId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transactionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      transactionStatus: {
        type: DataTypes.ENUM("Failed", "Pending", "Successful"),
        defaultValue: "Pending",
        allowNull: false,
      },
      billStatus: {
        type: DataTypes.ENUM("Failed", "Pending", "Successful"),
        defaultValue: "Pending",
        allowNull: false,
      },
      purchaseMetaData: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
    }),
  down: (queryInterface /* , Sequelize */) =>
    queryInterface.dropTable("guest_purchases"),
};
