const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authenticate } = require('../middleware/auth');

// Protected Routes
router.post('/add-expense', authenticate, expenseController.addExpense);
router.get('/get-expenses', authenticate, expenseController.getExpenses);
router.delete('/delete-expense/:id', authenticate, expenseController.deleteExpense);

module.exports = router;