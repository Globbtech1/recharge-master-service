"use strict";

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable("user_favourite_recharge", {
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
      sourceImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      uniqueNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nameAlias: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      productListId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      metaData: {
        type: DataTypes.STRING(1234),
        allowNull: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
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
    queryInterface.dropTable("user_favourite_recharge"),
};
