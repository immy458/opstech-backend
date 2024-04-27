const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("connecting to mongo db");
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = connectDB;
