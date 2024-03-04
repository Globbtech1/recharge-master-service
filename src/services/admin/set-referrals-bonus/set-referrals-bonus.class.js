const { Service } = require("feathers-sequelize");

exports.SetReferralsBonus = class SetReferralsBonus extends Service {
  async create(data, params) {
    try {
      // Check if a record already exists
      const existingRecord = await this.Model.findOne();

      if (existingRecord) {
        // If a record exists, update it
        const updatedRecord = await existingRecord.update(data);
        return updatedRecord.toJSON();
      } else {
        // If no record exists, create a new one
        const newRecord = await super.create(data, params);
        return newRecord;
      }
    } catch (error) {
      console.error("Error creating or updating referral bonus:", error);
      throw new Error("Failed to create or update referral bonus");
    }
  }
};
