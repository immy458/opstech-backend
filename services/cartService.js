const cart = require("../models/cart");

const getCartByUserId = async (userId) => {
  return await cart.findOne({ user: userId });
};

const createCart = async (userId) => {
  return await cart.create({ user: userId });
};

const addItemToCart = async (userId, dishId) => {
  let cart = await getCartByUserId(userId);

  const existingItem = cart.items.find((item) => item.dish.toString() === dishId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({ dish: dishId, quantity: 1 });
  }

  await cart.save();
  return cart;
};

const removeItemFromCart = async (userId, dishId) => {
  let cart = await getCartByUserId(userId);

  cart.items = cart.items.filter((item) => item.dish.toString() !== dishId);

  await cart.save();
  return cart;
};

const decrementItemQtyFromCart = async (userId, dishId) => {
  let cart = await getCartByUserId(userId);

  const existingItem = cart.items.find((item) => item.dish.toString() === dishId);

  if (existingItem) {
    if (existingItem.quantity === 1) {
      cart.items = cart.items.filter((item) => item.dish.toString() !== dishId);
    } else {
      existingItem.quantity -= 1;
    }
    await cart.save();
    return cart;
  }
};

module.exports = {
  addItemToCart,
  getCartByUserId,
  createCart,
  getCartByUserId,
  removeItemFromCart,
  decrementItemQtyFromCart,
};
