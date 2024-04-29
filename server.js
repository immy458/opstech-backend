require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbConnection");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());

connectDB();

app.use("/api", require("./routes/authRoutes"));

app.use("/api", require("./routes/dishRoutes"));

app.listen(process.env.APP_PORT || 8080, () => {
  console.log("App running on port:", process.env.APP_PORT || 8080);
});
