const { signupController, loginController, resetPassword } = require("../controllers/authController");
const auth = require("../middleware/auth");

const router = require("express").Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.patch("/reset-password", auth, resetPassword);

module.exports = router;
