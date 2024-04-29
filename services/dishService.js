const dish = require("../models/dish");

const addDish = async (dishData) => {
  return await dish.create(dishData);
};

const getDishById = async (_id) => {
  return await dish.findById(_id);
};

const getAllDishes = async (filter) => {
  return await dish.find({ ...filter });
};

const updateDishById = async (_id, data) => {
  return await dish.findByIdAndUpdate({ _id }, data, { new: true });
};

module.exports = { addDish, getDishById, updateDishById, getAllDishes };
