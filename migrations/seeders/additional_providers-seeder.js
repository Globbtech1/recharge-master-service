const { ShowCurrentDate } = require("../../src/dependency/UtilityFunctions");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const currentDate = ShowCurrentDate();
    const seederName = "providers-seederlllll";
    const providerImage =
      "https://seeklogo.com/images/M/MTN-logo-459AAF9482-seeklogo.png";

    // Check if the seeder has already run
    const seederStatus = await queryInterface.sequelize.query(
      `SELECT * FROM seeder_status WHERE seederName = '${seederName}'`
    );

    if (!seederStatus[0].length) {
      // The seeder hasn't run before

      // Check if providers already exist
      const existingProviders = await queryInterface.sequelize.query(
        `SELECT id FROM providers WHERE productName IN ('internal')`
      );
      // console.log(existingProviders[0]?.[0]?.id, "existingProviders[0]");
      if (existingProviders[0].length) {
        // Insert providers only if they don't exist
        // await queryInterface.bulkInsert("providers", [
        //   {
        //     productName: "internal",
        //     slug: "internal",
        //     image: providerImage,
        //     createdAt: currentDate,
        //     updatedAt: currentDate,
        //   },
        // ]);

        // Get the IDs of "internal"
        // const [internalId] = await queryInterface.sequelize.query(
        //   `SELECT id FROM providers WHERE productName IN ('internal')`
        // );

        // Use these IDs to insert into the product_list model or any other model as needed
        let internalId = existingProviders[0]?.[0]?.id;
        const productData = [
          // {
          //   providerId: internalId[0].id,
          //   productName: "Account Funding",
          //   slug: "Account-Funding",
          //   image: providerImage,
          //   allowedDiscount: 0,
          //   paymentType: "credit",
          //   createdAt: currentDate,
          //   updatedAt: currentDate,
          // },
          {
            providerId: internalId,
            productName: "Wallet Transfer",
            slug: "Wallet-Transfer",
            image: providerImage,
            allowedDiscount: 0,
            paymentType: "debit",
            createdAt: currentDate,
            updatedAt: currentDate,
          },
          {
            providerId: internalId,
            productName: "Wallet Credit",
            slug: "Wallet-Credit",
            image: providerImage,
            allowedDiscount: 0,
            paymentType: "credit",
            createdAt: currentDate,
            updatedAt: currentDate,
          },
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
    }

    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    const seederName = "providers-seeder";

    // Add commands to revert the seed here if needed
    await queryInterface.bulkDelete("product_list", null, {});
    await queryInterface.bulkDelete("providers", null, {});
    return queryInterface.bulkDelete("seeder_status", {
      seederName,
    });
  },
};
