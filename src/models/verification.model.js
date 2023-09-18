// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.

module.exports = function (app) {
    const { Sequelize, DataTypes } = app.get('sequelize');
  
    const Verification = Sequelize.define('Verification', {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
      Sequelize,
      paranoid: true,
    });
  
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    Verification.associate = (models) => {
      Verification.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return Verification;
  };
  