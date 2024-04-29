const mongoose = require("mongoose");
const { DISH_TYPES, DISH_CATEGORIES, DISH_CUISINE } = require("../constants");

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
  },
  cuisine: {
    type: String,
    enum: DISH_CUISINE,
    required: true,
  },
  type: {
    type: String,
    enum: DISH_TYPES,
    required: true,
  },
  category: {
    type: String,
    enum: DISH_CATEGORIES,
    required: true,
  },
});

module.exports = mongoose.model("dish", dishSchema);
