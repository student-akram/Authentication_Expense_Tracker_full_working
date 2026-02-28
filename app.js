require('dotenv').config();

const express = require('express');
const sequelize = require('./config/database');

const User = require('./models/user');
const Expense = require('./models/expense');
const passwordRoutes = require("./routes/password");

User.hasMany(Expense);
Expense.belongsTo(User);

const app = express();

app.use(express.json());  // 🔥 REQUIRED

app.use(express.static('public'));

app.use('/user', require('./routes/userRoutes'));
app.use('/expense', require('./routes/expenseRoutes'));
app.use("/password", passwordRoutes);

sequelize.sync().then(() => {
    console.log("Database connected successfully");
    app.listen(3100);
});