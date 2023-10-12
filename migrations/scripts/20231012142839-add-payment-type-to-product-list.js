"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("product_list", "paymentType", {
      type: Sequelize.ENUM("credit", "debit"),
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("product_list", "paymentType");
  },
};
