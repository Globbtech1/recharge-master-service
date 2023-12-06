const { Service } = require("feathers-sequelize");

exports.TransactionsHistory = class TransactionsHistory extends Service {
  constructor(options, app) {
    // this.options = options || {};
    super(options); // Call the constructor of the parent class

    this.app = app || {};
  }
  //   async getTotalAmountSpent(userId) {
  //     const sequelize = this.app.get("sequelizeClient");

  //     const { transactions_history } = sequelize.models;
  //     // const sequelize = this.Model.sequelize;
  //     const result = await transactions_history.sum("amountPaid", {
  //       where: { userId },
  //     });

  //     return result || 0;
  //   }
};
