const {
  addItemToCartController,
  removeItemFromCartController,
  getCartByUserIdController,
  decrementItemQtyFromCartController,
} = require("../controllers/cartController");
const auth = require("../middleware/auth");

const router = require("express").Router();

router.get("/cart", auth, getCartByUserIdController);
router.post("/cart", auth, addItemToCartController);
router.delete("/cart/:dishId", auth, removeItemFromCartController);
router.put("/cart", auth, decrementItemQtyFromCartController);

module.exports = router;
