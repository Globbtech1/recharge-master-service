const { ShowCurrentDate } = require("../../src/dependency/UtilityFunctions");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const currentDate = ShowCurrentDate();
    const seederName = "providers-seeder"; // Change this to a unique name for your seeder
    const providerImage =
      "https://seeklogo.com/images/M/MTN-logo-459AAF9482-seeklogo.png";
    // Check if the seeder has already run
    const seederStatus = await queryInterface.sequelize.query(
      `SELECT * FROM seeder_status WHERE seederName = '${seederName}'`
    );

    if (!seederStatus[0].length) {
      // The seeder hasn't run before
      // Insert your data into the providers and product_list tables
      // Insert "internal" and "external" into the providers table
      await queryInterface.bulkInsert("providers", [
        {
          productName: "internal",
          slug: "internal",
          image: providerImage,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        // {
        //   productName: "external",
        //   slug: "external",
        //   createdAt: currentDate,
        //   updatedAt: currentDate,
        // },
      ]);

      // Get the IDs of "internal" and "external"
      const [internalId] = await queryInterface.sequelize.query(
        // "SELECT id FROM providers WHERE productName IN ('internal', 'external')"
        "SELECT id FROM providers WHERE productName IN ('internal')"
      );

      // Use these IDs to insert into the product_list model or any other model as needed
      // You can add more data to insert into the product_list model here
      const productData = [
        {
          providerId: internalId[0].id,
          productName: "Account Funding",
          slug: "Account-Funding",
          image: providerImage,
          allowedDiscount: 0,
          paymentType: "credit",

          // Other fields
          createdAt: currentDate,
          updatedAt: currentDate,
        },
        // {
        //   providerId: externalId[0].id,
        //   productName: "Some Product for External",
        //   slug: "some-product-external",
        //   // Other fields
        //   createdAt: currentDate,
        //   updatedAt: currentDate,
        // },
        // Add more entries as needed
      ];

      // Insert data into the product_list table
      await queryInterface.bulkInsert("product_list", productData);

      // Mark the seeder as run in the seeder_status table
      await queryInterface.bulkInsert("seeder_status", [
        {
          seederName,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ]);
    }

    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    const seederName = "providers-seeder"; // Declare seederName

    // Add commands to revert the seed here if needed
    await queryInterface.bulkDelete("product_list", null, {});
    await queryInterface.bulkDelete("providers", null, {});
    return queryInterface.bulkDelete("seeder_status", {
      seederName,
    });
  },
};
