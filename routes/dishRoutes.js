const { addDishController, getAllDishesController } = require("../controllers/dishController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = require("express").Router();

router.post("/dishes", adminAuth, addDishController);
router.get("/dishes", getAllDishesController);

module.exports = router;
