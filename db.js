const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to database");
    })
    .catch(() => {
      console.log("error in connection to database");
    });
};

module.exports = connectDB;