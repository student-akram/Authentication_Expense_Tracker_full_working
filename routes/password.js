const express = require("express");
const router = express.Router();
const sib = require("sib-api-v3-sdk");

router.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Email received:", email);

    const defaultClient = sib.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const tranEmailApi = new sib.TransactionalEmailsApi();

    await tranEmailApi.sendTransacEmail({
      sender: { email: "akramshaik2004@gmail.com" }, // MUST be verified
      to: [{ email: email }],
      subject: "Reset Password",
      htmlContent: "<h3>Test mail working 🚀</h3>",
    });

    console.log("Email sent successfully");

    return res.status(200).json({ message: "Reset email sent successfully" });

  } catch (error) {
    console.log("Brevo error:", error.response?.body || error.message);
    return res.status(500).json({ message: "Email sending failed" });
  }
});

module.exports = router;