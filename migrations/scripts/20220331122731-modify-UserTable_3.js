"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    // Check if the column 'role' doesn't exist before adding it
    const hasRoleColumn = await queryInterface.describeTable("users").then(tableDefinition => !!tableDefinition.role);

    if (!hasRoleColumn) {
      await queryInterface.addColumn("users", "role", {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Access role of the user",
        defaultValue: "customer",
      });
    }

    // Check if the column 'isActive' doesn't exist before adding it
    const hasIsActiveColumn = await queryInterface.describeTable("users").then(tableDefinition => !!tableDefinition.isActive);

    if (!hasIsActiveColumn) {
      await queryInterface.addColumn("users", "isActive", {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }

    return Promise.resolve(); // Or any other result you want to return
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('transactions_history');
     */
    return Promise.all([
      queryInterface.removeColumn("users", "role"),
      queryInterface.removeColumn("users", "isActive"),
    ]);
  },
};
