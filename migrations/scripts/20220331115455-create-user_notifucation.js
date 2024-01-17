"use strict";

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable("notifications", {
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
      notificationMessage: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      action: {
        type: DataTypes.STRING,
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
    queryInterface.dropTable("notifications"),
};
