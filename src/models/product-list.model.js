// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const productList = sequelizeClient.define(
    "product_list",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      providerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      productName: {
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
        allowNull: true,
      },
      allowedDiscount: {
        allowNull: false,
        type: DataTypes.DOUBLE,
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
  productList.associate = function (models) {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    const { providers } = models;
    productList.belongsTo(providers, {
      foreignKey: "providerId", // This should match the actual foreign key column name in the productList table
      as: "provider", // Alias for the association
    });
  };

  return productList;
};
