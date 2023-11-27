// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const rewardUser = sequelizeClient.define(
    "reward_user",
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
      cashBackAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transactionsHistoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cashBackAmount: {
        type: DataTypes.DOUBLE,
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
  rewardUser.associate = function (models) {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return rewardUser;
};
