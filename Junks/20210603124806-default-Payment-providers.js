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
      "payment_providers",
      [
        {
          provider: "glo",
          image:
            "https://alerzopay.s3.eu-west-1.amazonaws.com/logos/telcos/glo-airtime.png",
          cashBackPercentage: 2,

          createdAt: currentDate,
          paymentListId: 0,
        },
        {
          provider: "glo",
          image:
            "https://alerzopay.s3.eu-west-1.amazonaws.com/logos/telcos/glo-airtime.png",
          cashBackPercentage: 2,

          createdAt: currentDate,
          paymentListId: 0,
        },
        {
          provider: "smile",
          image:
            "https://alerzopay.s3.eu-west-1.amazonaws.com/logos/telcos/smile-airtime.png",
          cashBackPercentage: 2,
          createdAt: currentDate,
          paymentListId: 0,
        },
        {
          provider: "smile",
          image:
            "https://alerzopay.s3.eu-west-1.amazonaws.com/logos/telcos/smile-airtime.png",
          cashBackPercentage: 2,
          createdAt: currentDate,
          paymentListId: 0,
        },
        {
          provider: "9mobile",
          image:
            "https://alerzopay.s3.eu-west-1.amazonaws.com/logos/telcos/nine-mobile-airtime.png",
          cashBackPercentage: 2,
          createdAt: currentDate,
          paymentListId: 0,
        },
        {
          provider: "9mobile",
          image:
            "https://alerzopay.s3.eu-west-1.amazonaws.com/logos/telcos/nine-mobile-airtime.png",
          cashBackPercentage: 2,
          createdAt: currentDate,
          paymentListId: 0,
        },
        {
          provider: "mtn",
          image:
            "https://alerzopay.s3.eu-west-1.amazonaws.com/logos/telcos/mtn-airtime.png",
          cashBackPercentage: 2,
          createdAt: currentDate,
          paymentListId: 0,
        },
        {
          provider: "mtn",
          image:
            "https://alerzopay.s3.eu-west-1.amazonaws.com/logos/telcos/mtn-airtime.png",
          cashBackPercentage: 2,
          createdAt: currentDate,
          paymentListId: 0,
        },
        {
          provider: "airtel",
          image:
            "https://alerzopay.s3.eu-west-1.amazonaws.com/logos/telcos/airtel-airtime.png",
          cashBackPercentage: 2,
          createdAt: currentDate,
          paymentListId: 0,
        },
        {
          provider: "airtel",
          image:
            "https://alerzopay.s3.eu-west-1.amazonaws.com/logos/telcos/airtel-airtime.png",
          cashBackPercentage: 2,
          createdAt: currentDate,
          paymentListId: 0,
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
    return queryInterface.bulkDelete("payment_providers", null, {});
  },
};
