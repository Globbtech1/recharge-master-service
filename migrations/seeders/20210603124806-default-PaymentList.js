"use strict";

const { ShowCurrentDate } = require("../../src/dependency/UtilityFunctions");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let currentDate = ShowCurrentDate();

    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert(
      "payment_list",
      [
        {
          name: "Account Funding",
          slug: "Account-Funding",
          image:
            "https://res.cloudinary.com/custocrypt/image/upload/v1659784031/Ufit/AirtimePurchase.png",
          isActive: true,
          // provider: "BAXI",
          // method: "BaxiIntegration",
          paymentType: "credit",
          createdAt: currentDate,
        },
        {
          name: "Airtime purchase",
          slug: "airtime-purchase",
          image:
            "https://res.cloudinary.com/custocrypt/image/upload/v1674194473/Ufit/AirtimePurchaseV2.png",
          isActive: true,
          // provider: "BAXI",
          // method: "BaxiIntegration",
          paymentType: "debit",
          createdAt: currentDate,
        },
        {
          name: "Data purchase",
          slug: "data-purchase",
          image:
            "https://res.cloudinary.com/custocrypt/image/upload/v1674194593/Ufit/DataPurchasev2.png",
          isActive: true,
          // provider: "BAXI",
          // method: "BaxiIntegration",
          paymentType: "debit",

          createdAt: currentDate,
        },
        {
          name: "Electricity bill",
          slug: "electricity-bill",
          image:
            "https://res.cloudinary.com/custocrypt/image/upload/v1674194633/Ufit/ElectricityPurchaseV2.png",
          isActive: true,
          paymentType: "debit",
          createdAt: currentDate,
        },
        {
          name: "Internet Subscription",
          slug: "internet-iubscription",
          image:
            "https://res.cloudinary.com/custocrypt/image/upload/v1674194697/Ufit/InternetSuscriotionv2.png",
          isActive: true,
          paymentType: "debit",
          createdAt: currentDate,
        },
        {
          name: "TV Subscription",
          slug: "TV-Subscription",
          image:
            "https://res.cloudinary.com/custocrypt/image/upload/v1674194785/Ufit/tvsusbscriotionv2.png",
          isActive: true,
          paymentType: "debit",
          createdAt: currentDate,
        },
        {
          name: "Sport Betting",
          slug: "Sport-Betting",
          image:
            "https://res.cloudinary.com/custocrypt/image/upload/v1674194876/Ufit/SportBettingv2.png",
          isActive: true,
          paymentType: "debit",
          createdAt: currentDate,
        },
        {
          name: "Exam PIN",
          slug: "Exam-PIN",
          image:
            "https://res.cloudinary.com/custocrypt/image/upload/v1674194551/Ufit/ExamPinv2.png",
          isActive: true,
          paymentType: "debit",
          createdAt: currentDate,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("payment_list", null, {});
  },
};
