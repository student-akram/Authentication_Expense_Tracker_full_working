const Expense = require('../models/expense');
const sequelize = require('../config/database');
const { categorizeExpense } = require("../services/aiService");


// =======================
// ADD EXPENSE
// =======================


exports.addExpense = async (req, res) => {

  const t = await sequelize.transaction();

  try {
    const { description, amount } = req.body;

    const category = await categorizeExpense(description);

    const newExpense = await Expense.create({
      amount,
      description,
      category,
      userId: req.user.userId
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: "Expense added successfully",
      data: newExpense
    });

  } catch (error) {

    await t.rollback();

    console.error("Add Expense Error:", error);

    res.status(500).json({
      message: "Error adding expense"
    });
  }
};

// =======================
// GET USER EXPENSES ONLY
// =======================
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: {
        userId: req.user.userId
      }
    });

    res.status(200).json(expenses);

  } catch (err) {
    console.log("Fetch Expense Error:", err);
    res.status(500).json({
      message: "Error fetching expenses"
    });
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