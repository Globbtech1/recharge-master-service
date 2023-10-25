"use strict";
module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable("coupon_management", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userCategory: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      couponCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      couponValue: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      valueIsPercentage: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default to fixed amount
      },
      minimumRecharge: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      maximumRecharge: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      validity: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      commencement: {
        type: DataTypes.DATE,
        defaultValue: null,
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
    queryInterface.dropTable("coupon_management"),
};
