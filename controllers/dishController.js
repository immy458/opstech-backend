const { DishValidationError } = require("../Exceptions");
const { DISH_TYPES, DISH_CATEGORIES, DISH_CUISINE } = require("../constants");
const { addDish, getAllDishes } = require("../services/dishService");
const { createResponse } = require("../utilities");

const validateValue = (value, array, fieldName) => {
  if (!array.includes(value)) {
    throw new DishValidationError(`Invalid '${fieldName}' value. Supported ${fieldName}s: ${array.join(", ")}`);
  }
};

const addDishController = async (req, res, next) => {
  const { name, description, price, cuisine, type, category } = req.body;
  if (!name || !price || !cuisine || !type || !category) {
    return res.status(400).json(createResponse(false, null, "Missing required attributes"));
  }

  try {
    validateValue(type, DISH_TYPES, "type");
    validateValue(cuisine, DISH_CUISINE, "cuisine");
    validateValue(category, DISH_CATEGORIES, "category");

    const dish = await addDish({ name, description, price, cuisine, type, category });
    return res.status(200).json(createResponse(true, dish, null));
  } catch (error) {
    console.error(error);
    if (error instanceof DishValidationError) {
      return res.status(400).json(createResponse(false, null, error.message));
    }
    return res.status(500).json(createResponse(false, null, "Internal Server Error"));
  }
};

const getAllDishesController = async (req, res, next) => {
  try {
    const { cuisine, type, category } = req.query;
    const filter = {};
    if (cuisine) filter.cuisine = cuisine;
    if (type) filter.type = type;
    if (category) filter.category = category;

    const dishes = await getAllDishes(filter);
    return res.status(200).json(createResponse(true, dishes, null));
  } catch (error) {
    console.error(error);
    if (error instanceof DishValidationError) {
      return res.status(400).json(createResponse(false, null, error.message));
    }
    return res.status(500).json(createResponse(false, null, "Internal Server Error"));
  }
};

module.exports = { addDishController, getAllDishesController };
