// "use strict";
// module.exports = {
//   up: async (queryInterface, DataTypes) => {
//     /**
//      * Add altering commands here.
//      *
//      * Example:
//      * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
//      */
//     return Promise.all([
//       queryInterface.addColumn("users", "role", {
//         type: DataTypes.STRING,
//         allowNull: false,
//         comment: "Access role of the user",
//         defaultValue: "customer",
//       }),

//       queryInterface.addColumn("users", "isActive", {
//         type: DataTypes.BOOLEAN,
//         allowNull: false,
//         defaultValue: true,
//       }),
//     ]);
//   },

//   down: async (queryInterface, Sequelize) => {
//     /**
//      * Add reverting commands here.
//      *
//      * Example:
//      * await queryInterface.dropTable('transactions_history');
//      */
//     return Promise.all([
//       queryInterface.removeColumn("users", "role"),
//       queryInterface.removeColumn("users", "isActive"),
//     ]);
//   },
// };
