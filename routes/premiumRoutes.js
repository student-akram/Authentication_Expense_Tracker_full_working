const express = require("express");
const router = express.Router();
const premiumController = require("../controllers/premiumController");
const { authenticate } = require("../middleware/auth");

router.get("/download", authenticate, premiumController.downloadReport);

module.exports = router;