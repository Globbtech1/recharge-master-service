// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const couponManagement = sequelizeClient.define(
    "coupon_management",
    {
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
    },
    {
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line no-unused-vars
  couponManagement.associate = function (models) {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return couponManagement;
};
