"use strict";

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.renameColumn(
      "transactions_history",
      "paymentListId",
      "productId"
    );
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.renameColumn(
      "transactions_history",
      "productId",
      "paymentListId"
    );
  },
};
