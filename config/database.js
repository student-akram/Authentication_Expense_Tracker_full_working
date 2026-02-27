const { Sequelize } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize(
  'expense_details',   // 🔹 Your database name
  'root',            // 🔹 MySQL username
  'root',            // 🔹 MySQL password
  {
    host: 'localhost',
    dialect: 'mysql',
    
  }
);

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to database:', err);
  });

module.exports = sequelize;