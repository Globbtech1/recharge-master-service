// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const paymentList = sequelizeClient.define(
    "payment_list",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      paymentType: {
        type: DataTypes.ENUM("debit", "credit"),
        allowNull: false,
      },
      // cashBackPercentage: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   default: 1,
      // },
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
      Sequelize,
      paranoid: true,
    }
  );

  // eslint-disable-next-line no-unused-vars
  paymentList.associate = function (models) {
    const { quick_beneficiary, transactions_history, guest_purchases } = models;
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    paymentList.hasMany(quick_beneficiary);
    paymentList.hasOne(transactions_history);
    paymentList.hasOne(guest_purchases);
  };

  return paymentList;
};
