const {
  getCartByUserId,
  createCart,
  addItemToCart,
  removeItemFromCart,
  decrementItemQtyFromCart,
  getFullCartItemsByUserId,
} = require("../services/cartService");
const { createResponse } = require("../utilities");

const getCartByUserIdController = async (req, res, next) => {
  const userId = req.userId;
  try {
    let cart = await getFullCartItemsByUserId(userId);

    return res.status(200).json(createResponse(true, cart, null));
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json(createResponse(false, null, "Internal Server Error"));
  }
};

const addItemToCartController = async (req, res, next) => {
  const userId = req.userId;
  const { dishId } = req.body;
  try {
    let cart = await getCartByUserId(userId);

    if (!cart) {
      console.log(`creating cart for userId : ${userId}`);
      await createCart(userId);
    }

    console.log(`Adding item to cart: ${userId}`);
    const updatedCart = await addItemToCart(userId, dishId);
    console.log(`Cart item updated scuccessfullty`);

    return res.status(200).json(createResponse(true, updatedCart, null));
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json(createResponse(false, null, "Internal Server Error"));
  }
};

const removeItemFromCartController = async (req, res, next) => {
  const userId = req.userId;
  const { dishId } = req.params;
  try {
    let cart = await getCartByUserId(userId);

    if (!cart) {
      return res.status(400).json(createResponse(false, null, "Cart doesn't exits"));
    }

    console.log(`deleted item from user cart: ${userId}, with dish Id: ${dishId}`);
    const updatedCart = await removeItemFromCart(userId, dishId);
    console.log(`Cart item deleted scuccessfullty`);

    return res.status(200).json(createResponse(true, updatedCart, null));
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json(createResponse(false, null, "Internal Server Error"));
  }
};

const decrementItemQtyFromCartController = async (req, res, next) => {
  const userId = req.userId;
  const { dishId } = req.body;
  try {
    let cart = await getCartByUserId(userId);

    if (!cart) {
      return res.status(400).json(createResponse(false, null, "Cart doesn't exits"));
    }

    console.log(`decrementing item from user cart: ${userId}, for dish Id: ${dishId}`);
    const updatedCart = await decrementItemQtyFromCart(userId, dishId);
    console.log(`Cart item updated scuccessfullty`);

    return res.status(200).json(createResponse(true, updatedCart, null));
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json(createResponse(false, null, "Internal Server Error"));
  }
};

module.exports = {
  addItemToCartController,
  removeItemFromCartController,
  getCartByUserIdController,
  decrementItemQtyFromCartController,
};
