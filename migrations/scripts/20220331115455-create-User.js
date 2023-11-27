"use strict";

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.createTable("users", {
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
      },
      walletId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      invitedBy: {
        type: DataTypes.STRING,
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
    }),
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable("users"),
};
