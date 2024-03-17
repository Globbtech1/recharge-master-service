const { Service } = require("feathers-sequelize");
const Joi = require("joi");

// Joi schema for input validation
const mobileBannerSchema = Joi.object({
  bannerUrl: Joi.string().required(),
  type: Joi.string().required(),
  route: Joi.string().required(),
});

exports.MobileBanners = class MobileBanners extends Service {
  async create(data, params) {
    try {
      // Validate input data using Joi schema
      await mobileBannerSchema.validateAsync(data);

      // Call the original create method to save the validated data
      return super.create(data, params);
    } catch (error) {
      console.error("Error validating or saving mobile banner:", error);
      throw error;
    }
  }
};
