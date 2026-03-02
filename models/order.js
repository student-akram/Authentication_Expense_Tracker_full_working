const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Order = sequelize.define("order", {
  orderId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  orderAmount: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

User.hasMany(Order);
Order.belongsTo(User);

module.exports = Order;