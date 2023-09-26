"use strict";

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.renameColumn(
      "transactions_history",
      "paymentListId",
      "productListId"
    );
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.renameColumn(
      "transactions_history",
      "productListId",
      "paymentListId"
    );
  },
};
