// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const scheduleBillsPayment = sequelizeClient.define(
    "schedule_bills_payment",
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
      frequency: {
        type: DataTypes.ENUM("daily", "weekly", "monthly"),
        allowNull: false,
      },
      dayOfWeek: {
        type: DataTypes.ENUM(
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ),
        allowNull: true,
      },
      dayOfMonth: {
        type: DataTypes.INTEGER, // 1-31
        allowNull: true,
      },
      PaymentMetaData: {
        type: DataTypes.STRING(1234),
        allowNull: true,
      },
      productListId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      purchaseAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      lastExecution: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      nextExecution: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      retryCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastExecutionPaymentStatus: {
        type: DataTypes.ENUM("Failed", "Successful"),
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
      Sequelize,
      paranoid: true,
    }
  );

  // eslint-disable-next-line no-unused-vars
  scheduleBillsPayment.associate = function (models) {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    const { product_list } = models;
    scheduleBillsPayment.belongsTo(product_list);
  };

  return scheduleBillsPayment;
};
