const mongoose = require("mongoose");
const Expense = require('../models/expense');
const { categorizeExpense } = require("../services/aiService");




exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;

    console.log("👉 Incoming:", amount, description, category);

    // optional AI category fallback
    let finalCategory = category;
    if (!category || category === "") {
      finalCategory = await categorizeExpense(description);
    }

    const expense = await Expense.create({
      amount,
      description,
      category: finalCategory,
      userId: req.user._id
    });

    console.log("✅ Saved Expense:", expense);

    res.status(201).json(expense);

  } catch (error) {
    console.log("🔥 Add Expense Error:", error);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;   // 🔥 FORCE 5 ALWAYS

    const skip = (page - 1) * limit;

    const expenses = await Expense.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalExpenses = await Expense.countDocuments({
      userId: req.user._id
    });

    res.status(200).json({
      expenses,
      currentPage: page,
      totalPages: Math.ceil(totalExpenses / limit)
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses" });
  }
};



exports.deleteExpense = async (req, res) => {
  try {
    const id = req.params.id;

    console.log("👉 Delete ID:", id);
    console.log("👉 User ID:", req.user._id);

    const result = await Expense.deleteOne({
      _id: new mongoose.Types.ObjectId(id),   // 🔥 FIX HERE
      userId: req.user._id
    });

    console.log("👉 Delete result:", result);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    console.log("🔥 Delete Error:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};