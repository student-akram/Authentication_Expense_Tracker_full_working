const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: String,
  status: String,
  orderAmount: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Order", orderSchema);