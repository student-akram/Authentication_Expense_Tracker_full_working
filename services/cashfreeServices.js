const { Cashfree, CFEnvironment } = require("cashfree-pg");
require("dotenv").config();

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CF_APP_ID,
  process.env.CF_SECRET_KEY
);

exports.createCashfreeOrder = async (
  orderId,
  amount,
  user
) => {

  const request = {
    order_id: orderId,
    order_amount: amount,
    order_currency: "INR",
    customer_details: {
      customer_id: user.id.toString(),
      customer_email: user.email,
      customer_phone: "9999999999"
    },
    order_meta: {
      return_url: `${process.env.BASE_URL}/payment/verify/${orderId}`
    }
  };

  const response = await cashfree.PGCreateOrder(request);
  return response.data;
};

exports.verifyCashfreePayment = async (orderId) => {
  return await cashfree.PGOrderFetchPayments(orderId);
};