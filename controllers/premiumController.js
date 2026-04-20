const Expense = require("../models/expense");
const { uploadToS3 } = require("../services/s3Service");

exports.downloadReport = async (req, res) => {
  if (!req.user.isPremium) {
    return res.status(401).json({ message: "Not premium" });
  }

  const expenses = await Expense.find({ userId: req.user._id });

  const fileURL = await uploadToS3(
    JSON.stringify(expenses),
    `Expense-${req.user._id}.json`
  );

  res.json({ fileURL });
};