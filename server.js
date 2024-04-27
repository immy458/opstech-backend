require("dotenv").config();
const connectDB = require("./config/dbConnection");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api", require("./routes/authRoutes"));

app.listen(process.env.APP_PORT || 8080, () => {
  console.log("App running on port:", process.env.APP_PORT || 8080);
});
