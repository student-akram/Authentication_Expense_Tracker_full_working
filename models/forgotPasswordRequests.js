const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: String,
  userId: mongoose.Schema.Types.ObjectId,
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("ForgotPasswordRequests", schema);