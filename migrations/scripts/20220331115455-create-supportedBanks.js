"use strict";

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable("supported_banks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      bankName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bankCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
    queryInterface.dropTable("supported_banks"),
};
