// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const setReferralsBonus = sequelizeClient.define(
    "set_referrals_bonus",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      isReferralActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      bonusAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      minimumSpentAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
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
  setReferralsBonus.associate = function (models) {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return setReferralsBonus;
};
