const User = require("../models/user");
const Order = require("../models/order");
const { createCashfreeOrder, verifyCashfreePayment } = require("../services/cashfreeServices");

exports.createOrder = async (req, res) => {
  try {
    const user = req.user;

    if (user.isPremium) {
      return res.status(400).json({
        message: "You are already a premium user."
      });
    }

    const orderId = "ORDER_" + Date.now();

    await Order.create({
      orderId,
      status: "PENDING",
      userId: user.id,
      orderAmount: 2000
    });

    const paymentData = await createCashfreeOrder(
      orderId,
      2000,
      user
    );

    res.status(200).json({
      payment_session_id: paymentData.payment_session_id,
      order_id: orderId
    });

  } catch (err) {
    console.log("Create Order Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {

    const { orderId } = req.params;

    const response = await verifyCashfreePayment(orderId);

    if (!response.data || response.data.length === 0) {
      return res.redirect("/index.html?status=failed");
    }

    const paymentStatus = response.data[0].payment_status;

    const order = await Order.findOne({ where: { orderId } });

    if (!order) {
      return res.redirect("/index.html?status=failed");
    }

    if (paymentStatus && paymentStatus.includes("SUCCESS")) {

      order.status = "SUCCESSFUL";
      await order.save();

      const user = await User.findByPk(order.userId);
      user.isPremium = true;
      await user.save();

      return res.redirect("/index.html?status=success");

    } else {

      order.status = "FAILED";
      await order.save();

      return res.redirect("/index.html?status=failed");
    }

  } catch (err) {
    console.error(err);
    return res.redirect("/index.html?status=failed");
  }
};