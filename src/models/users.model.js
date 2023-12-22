// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const users = sequelizeClient.define(
    "users",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:
          "https://res.cloudinary.com/cvtechdom/image/upload/v1584379801/Cervitech_AndroidApp/bupwntkxpcmklgc0o3u0.png",
      },
      isVerify: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deviceId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fcmToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      securityPin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      platform: {
        type: DataTypes.STRING,
        type: DataTypes.ENUM("google", "apple", "facebook", "email"),
        allowNull: true,
        defaultValue: "email",
      },
      refererLink: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      walletId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      invitedBy: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isEmailVerify: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      isPhoneNumberVerify: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      isAccountLocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      reasonForAccountLock: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: false,
      },
      localGovernment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
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
  users.associate = function (models) {
    const { generateaccount, account_balance, transactions_history } = models;
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html

    users.hasMany(generateaccount);
    // users.hasMany(transactions_history);
    users.hasOne(account_balance);
    users.hasMany(transactions_history, {
      foreignKey: "userId",
      as: "transactionsHistory",
    }); // Add this line
  };

  return users;
};
