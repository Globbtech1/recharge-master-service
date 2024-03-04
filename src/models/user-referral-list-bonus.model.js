// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const userReferralListBonus = sequelizeClient.define(
    "user_referral_list_bonus",
    {
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
      bonusAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      referredUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isBonusPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bonusPaidOn: {
        allowNull: true,
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
  userReferralListBonus.associate = function (models) {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return userReferralListBonus;
};
