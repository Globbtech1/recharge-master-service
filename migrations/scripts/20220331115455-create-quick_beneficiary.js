"use strict";

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable("quick_beneficiary", {
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
        allowNull: false,
      },
      productListId: {
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
    queryInterface.dropTable("quick_beneficiary"),
};
