require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/user', require('./routes/userRoutes'));
app.use('/expense', require('./routes/expenseRoutes'));
app.use('/password', require('./routes/password'));
app.use('/premium', require('./routes/premiumRoutes'));
app.use('/payment', require('./routes/paymentRoute'));

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});