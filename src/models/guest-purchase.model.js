// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const guestPurchase = sequelizeClient.define(
    "guest_purchases",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      referenceNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      monnifyReference: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      metaData: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      paymentListId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      transactionStatus: {
        type: DataTypes.ENUM("Failed", "Pending", "Successful"),
        defaultValue: "Pending",
        allowNull: false,
      },
      billStatus: {
        type: DataTypes.ENUM("Failed", "Pending", "Successful"),
        defaultValue: "Pending",
        allowNull: false,
      },
      purchaseMetaData: {
        type: DataTypes.JSON,
        allowNull: true,
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
  guestPurchase.associate = function ({ payment_list }) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    guestPurchase.belongsTo(payment_list, { foreignKey: "paymentListId" });
  };

  return guestPurchase;
};
