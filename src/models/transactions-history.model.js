// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const transactionsHistory = sequelizeClient.define(
    "transactions_history",
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
      paymentType: {
        type: DataTypes.ENUM("debit", "credit"),
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
      referenceNumber: {
        type: DataTypes.STRING(1234),
        allowNull: true,
      },
      metaData: {
        type: DataTypes.STRING(1234),
        allowNull: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transactionDate: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      transactionStatus: {
        type: DataTypes.ENUM("Failed", "Successful"),
        allowNull: false,
      },
      paidBy: {
        type: DataTypes.STRING,
        allowNull: false,
        default: "self",
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
      Sequelize,
      paranoid: true,
    }
  );

  // eslint-disable-next-line no-unused-vars
  transactionsHistory.associate = function (models) {
    const { payment_list } = models;
    transactionsHistory.belongsTo(payment_list);
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return transactionsHistory;
};
