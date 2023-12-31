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
      productListId: {
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
      amountPaid: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.ENUM("wallet", "paystack", "others"),
        allowNull: false,
      },
      transactionType: {
        type: DataTypes.STRING,
        allowNull: false,
        default: "",
      },
      platform: {
        type: DataTypes.ENUM("web", "mobile", "schedule", "auto"),
        allowNull: true,
        defaultValue: "auto",
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
      tableName: "transactions_history",
    }
  );

  // eslint-disable-next-line no-unused-vars
  transactionsHistory.associate = function (models) {
    const { product_list, users } = models;
    transactionsHistory.belongsTo(product_list);
    transactionsHistory.belongsTo(users);
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return transactionsHistory;
};
