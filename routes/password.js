const express = require("express");
const router = express.Router();
const sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const ForgotPasswordRequests = require("../models/forgotPasswordRequests");


// ========================================
// FORGOT PASSWORD - GENERATE RESET LINK
// ========================================
router.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

   if (!user) {
  return res.status(200).json({
    message: "If the email is registered, a reset link has been sent."
  });
}
    // Generate UUID
    const id = uuidv4();

    // Store request in DB
    await ForgotPasswordRequests.create({
      id: id,
      userId: user.id,
      isActive: true,
    });

    // Brevo setup
    const defaultClient = sib.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const tranEmailApi = new sib.TransactionalEmailsApi();

    // Send reset link
    await tranEmailApi.sendTransacEmail({
      sender: { email: "akramshaik2004@gmail.com" }, // must be verified
      to: [{ email: email }],
      subject: "Reset Your Password",
      htmlContent: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="http://localhost:3100/password/resetpassword/${id}">
          Reset Password
        </a>
      `,
    });

    return res.status(200).json({ message: "Reset link sent successfully" });

  } catch (error) {
    console.log("Forgot password error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});


// ========================================
// VERIFY RESET LINK
// ========================================
router.get("/resetpassword/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const request = await ForgotPasswordRequests.findOne({
      where: { id: id, isActive: true },
    });

    if (!request) {
      return res.status(400).send("Invalid or expired reset link");
    }

    // Send simple HTML form
    res.send(`
      <h2>Reset Password</h2>
      <form action="/password/updatepassword/${id}" method="POST">
        <input type="password" name="newpassword" placeholder="Enter new password" required />
        <button type="submit">Update Password</button>
      </form>
    `);

  } catch (error) {
    console.log("Reset link error:", error);
    res.status(500).send("Error validating reset link");
  }
});


// ========================================
// UPDATE PASSWORD
// ========================================
router.post("/updatepassword/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { newpassword } = req.body;

    const request = await ForgotPasswordRequests.findOne({
      where: { id: id, isActive: true },
    });

    if (!request) {
      return res.status(400).send("Reset link expired");
    }

    const user = await User.findByPk(request.userId);

    // Hash new password
    const hashedPassword = await bcrypt.hash(newpassword, 10);

    user.password = hashedPassword;
    await user.save();

    // Make link inactive
    request.isActive = false;
    await request.save();

    res.send("Password updated successfully. You can now login.");

  } catch (error) {
    console.log("Update password error:", error);
    res.status(500).send("Error updating password");
  }
});

module.exports = router;