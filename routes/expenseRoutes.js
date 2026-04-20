const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authenticate } = require('../middleware/auth');

router.post('/add-expense', authenticate, expenseController.addExpense);
router.get('/get-expenses', authenticate, expenseController.getExpenses);
router.delete('/delete-expense/:id', authenticate, (req, res, next) => {
    console.log("🔥 DELETE ROUTE HIT:", req.params.id);
    next();
}, expenseController.deleteExpense);

module.exports = router;