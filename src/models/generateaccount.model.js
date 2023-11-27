// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const generateaccount = sequelizeClient.define(
    "generateaccount",
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
      bankName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bankCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountReference: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otherDetails: {
        type: DataTypes.STRING(1234),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
  generateaccount.associate = function (models) {
    const { users } = models;
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    generateaccount.belongsTo(users);
  };

  return generateaccount;
};
