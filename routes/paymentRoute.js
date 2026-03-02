const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const paymentController = require("../controllers/paymentController");

router.post("/create-order", authenticate, paymentController.createOrder);
router.get("/verify/:orderId", paymentController.verifyPayment);

module.exports = router;