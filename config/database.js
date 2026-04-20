const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "expenseTracker"
    });

    console.log("✅ MongoDB Connected");
    console.log("👉 DB Name:", mongoose.connection.name);

  } catch (err) {
    console.log("DB Error:", err);
  }
};

module.exports = connectDB;