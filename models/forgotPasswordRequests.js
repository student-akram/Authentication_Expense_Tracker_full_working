const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const ForgotPasswordRequests = sequelize.define("forgotpasswordrequests", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = ForgotPasswordRequests;