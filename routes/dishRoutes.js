const { addDishController } = require("../controllers/dishController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = require("express").Router();

router.post("/dish", adminAuth, addDishController);

module.exports = router;
