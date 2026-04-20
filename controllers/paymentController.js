const User = require("../models/user");
const Order = require("../models/order");
const { createCashfreeOrder, verifyCashfreePayment } = require("../services/cashfreeServices");

exports.createOrder = async (req, res) => {
  if (req.user.isPremium) {
    return res.status(400).json({ message: "Already premium" });
  }

  const orderId = "ORDER_" + Date.now();

  await Order.create({
    orderId,
    status: "PENDING",
    userId: req.user._id,
    orderAmount: 2000
  });

  const payment = await createCashfreeOrder(orderId, 2000, req.user);

  res.json(payment);
};

exports.verifyPayment = async (req, res) => {
  const { orderId } = req.params;

  const response = await verifyCashfreePayment(orderId);

  const order = await Order.findOne({ orderId });

  if (response.data[0].payment_status.includes("SUCCESS")) {
    order.status = "SUCCESS";
    await order.save();

    const user = await User.findById(order.userId);
    user.isPremium = true;
    await user.save();

    return res.redirect("/index.html?status=success");
  }

  res.redirect("/index.html?status=failed");
};