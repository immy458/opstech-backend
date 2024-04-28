const {
  signupController,
  loginController,
  changePassword,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

const router = require("express").Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.patch("/change-password", auth, changePassword);
router.post("/request-password-request", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
