const Expense = require('../models/expense');
const sequelize = require('../config/database');
const { categorizeExpense } = require("../services/aiService");


// =======================
// ADD EXPENSE
// =======================


exports.addExpense = async (req, res) => {
  try {
    const { amount, description } = req.body;

    let category;

    try {
      category = await aiService.getCategory(description);
    } catch (error) {
      console.log("OpenAI failed. Using fallback logic.");
      category = "Other";  // 🔥 mandatory fallback
    }

    const expense = await Expense.create({
      amount,
      description,
      category,
      userId: req.user.id
    });

    res.status(201).json({ expense });

  } catch (error) {
    console.log("Add Expense Error:", error);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

// =======================
// GET USER EXPENSES ONLY
// =======================
exports.getExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Expense.findAndCountAll({
      where: { userId: req.user.id },
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      expenses: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalExpenses: count
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};


// =======================
// DELETE EXPENSE (OWNER ONLY)
// =======================
exports.deleteExpense = async (req, res) => {

  const t = await sequelize.transaction();

  try {
    const expenseId = req.params.id;

    const expense = await Expense.findOne({
      where: {
        id: expenseId,
        userId: req.user.userId
      },
      transaction: t
    });

    if (!expense) {
      await t.rollback();
      return res.status(404).json({
        message: "Expense not found or not authorized"
      });
    }

    await expense.destroy({ transaction: t });

    await t.commit();

    res.status(200).json({
      message: "Expense deleted successfully"
    });

  } catch (err) {

    await t.rollback();

    console.log("Delete Expense Error:", err);

    res.status(500).json({
      message: "Error deleting expense"
    });
  }
};