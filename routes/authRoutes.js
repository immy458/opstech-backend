const {
  signupController,
  loginController,
  changePasswordController,
  requestPasswordResetController,
  resetPasswordController,
  logoutController,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

const router = require("express").Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.patch("/change-password", auth, changePasswordController);
router.post("/request-password-request", requestPasswordResetController);
router.post("/reset-password", resetPasswordController);
router.get("/logout", logoutController);

module.exports = router;
