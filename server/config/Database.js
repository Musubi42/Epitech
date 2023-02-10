const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.set("strictQuery", false);
    await mongoose.connect("mongodb+srv://MiniChat:Azerty12345@minichat.7nhw5wm.mongodb.net/MiniChat", {
      useNewUrlParser: true
    });
    console.log("Database connected.");
  } catch (error) {
    console.log("Failed to connect database.");
  }
};

module.exports = connectDB;