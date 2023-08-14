const Sequelize = require("sequelize");
const enVariables = require("../src/config/config.json");

module.exports = function (app) {
  let sequelize;
  // import enVariables from "../config/config.json";

  // const basename = path.basename(__filename);
  const env = process.env.NODE_ENV || "development";
  const config = enVariables[env];
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      define: {
        freezeTableName: true,
      },
    });
  } else {
    console.log("enter here", config.database);
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
    );
    // const connectionString = app.get("mysql");
    // console.log("enter here", connectionString);

    // sequelize = new Sequelize(connectionString, {
    //   dialect: "mysql",
    //   logging: false,
    //   define: {
    //     freezeTableName: true,
    //   },
    // });
  }

  const oldSetup = app.setup;

  app.set("sequelizeClient", sequelize);

  app.setup = function (...args) {
    const result = oldSetup.apply(this, args);

    // Set up data relationships
    const models = sequelize.models;
    Object.keys(models).forEach((name) => {
      if ("associate" in models[name]) {
        models[name].associate(models);
      }
    });

    // Sync to the database
    // app.set('sequelizeSync', sequelize.sync());
    // app.set('sequelizeSync', sequelize.sync({ alter: true }));

    return result;
  };
};
