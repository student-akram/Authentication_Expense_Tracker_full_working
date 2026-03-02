const Expense = require("../models/expense");
const { uploadToS3 } = require("../services/s3Service");

exports.downloadReport = async (req, res) => {

  if (!req.user.isPremium) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const expenses = await Expense.findAll({
    where: { userId: req.user.id }
  });

  const stringifiedExpenses = JSON.stringify(expenses);

  const filename = `Expense-${req.user.id}-${Date.now()}.json`;

  const fileURL = await uploadToS3(stringifiedExpenses, filename);

  res.status(200).json({ fileURL });
};