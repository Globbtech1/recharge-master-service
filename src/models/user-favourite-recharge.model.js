// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const userFavouriteRecharge = sequelizeClient.define(
    "user_favourite_recharge",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sourceImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      uniqueNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nameAlias: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      productListId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      metaData: {
        type: DataTypes.STRING(1234),
        allowNull: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
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
  userFavouriteRecharge.associate = function (models) {
    const { product_list } = models;
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    userFavouriteRecharge.belongsTo(product_list);
  };

  return userFavouriteRecharge;
};
