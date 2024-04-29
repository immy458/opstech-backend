const bcrypt = require("bcryptjs");
const { TOKEN_EXPIRATION_IN_SECS } = require("../constants");
const { generateAuthToken, generatePasswordResetToken } = require("../utilities/tokenUtils");
const { addUser, getUserByName, updateUserById, getUserById, getUserByEmail } = require("../services/userService");
const { createResponse } = require("../utilities");
const { hashPassword, verifyPassword, validatePasswordStrength } = require("../utilities/passwordUtils");
const { getTokenByUserId, deleteTokenByUserId, addToken } = require("../services/tokenService");
const { sendPasswordResetRequestEmail, sendPasswordResetSuccessfullEmail } = require("../utilities/emailUtils");

const signupController = async (req, res, next) => {
  const { username, password, role, email, firstName, lastName } = req.body;
  try {
    validatePasswordStrength(password);
    const hashedPassword = await hashPassword(password);
    const userData = { username, password: hashedPassword, email, firstName, lastName };
    if (role) userData.role = role;

    await addUser(userData);
    return res.status(201).json(createResponse(true, "User signed up successfully.", null));
  } catch (error) {
    console.error(error);
    if (error.name === "MongoServerError" && error.code === 11000) {
      if (error.message.toLowerCase().includes("username"))
        return res.status(400).json(createResponse(false, null, "Username is already taken."));
      else if (error.message.toLowerCase().includes("email"))
        return res.status(400).json(createResponse(false, null, "Email is already registered."));

      return res.status(400).json(createResponse(false, null, "Username is already taken."));
    } else if (error.name === "InvalidPasswordFormatError") {
      return res.status(400).json(createResponse(false, null, error.message));
    } else {
      return res.status(500).json(createResponse(false, null, "Internal Server Error"));
    }
  }
};

const loginController = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json(createResponse(false, null, "Username or password not provided"));
  }
  try {
    const user = await getUserByName(username);
    if (!user) {
      return res.status(404).json(createResponse(false, null, "Invalid username or password."));
    }

    console.log(`Found user with username "${username}":`, user);

    if (!(await verifyPassword(password, user.password))) {
      return res.status(401).json(createResponse(false, null, "Invalid username or password."));
    }
    delete user._doc.password;
    delete user._doc.createdAt;
    delete user._doc.updatedAt;

    const token = generateAuthToken({ _id: user._id, username: user.username, role: user.role });
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: TOKEN_EXPIRATION_IN_SECS * 1000, // 2hrs in ms
      sameSite: "None",
      secure: true,
    });
    return res.status(200).json(createResponse(true, user, null));
  } catch (error) {
    console.error(error);
    return res.status(500).json(createResponse(false, null, "Internal Server Error"));
  }
};

const changePasswordController = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.userId;

  if (!currentPassword || !newPassword)
    return res.status(400).json(createResponse(false, null, "Current or New Password not provided"));
  try {
    validatePasswordStrength(newPassword);

    console.log(`Finding user with ID: ${userId}`);
    const user = await getUserById(userId);
    if (!user) return res.status(404).json(createResponse(false, null, "User not found"));
    console.log(`Found user with id "${userId}":`, user);

    console.log("Verifying current password");
    if (!(await verifyPassword(currentPassword, user.password)))
      return res.status(400).json(createResponse(false, null, "Current password is invalid."));

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    await updateUserById(userId, user);
    return res.status(200).json(createResponse(true, "Password updated successfully"));
  } catch (error) {
    console.error(error);
    if (error.name === "InvalidPasswordFormatError") {
      return res.status(400).json(createResponse(false, null, error.message));
    }
    return res.status(500).json(createResponse(false, null, "Internal Server Error"));
  }
};

const requestPasswordResetController = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user)
      return res
        .status(404)
        .json(
          createResponse(
            false,
            null,
            "We couldn't find an account associated with that email address. Please double-check and try again"
          )
        );
    console.log(`Found user with email "${email}":`, user);

    const existingToken = await getTokenByUserId(user._id);

    if (existingToken) {
      console.log(`Deleting old token from db for user '${email}'`);
      await deleteTokenByUserId(user._id);
    }

    const resetToken = generatePasswordResetToken();
    const hashedToken = await bcrypt.hash(resetToken, Number(process.env.SALT_ROUNDS));
    console.log("Adding genertated token to db");
    await addToken({ userId: user._id, token: hashedToken, createdAt: Date.now() });

    const link = `${process.env.CLIENT_URL}/password-reset?token=${resetToken}&id=${user._id}`;
    await sendPasswordResetRequestEmail(link, email);

    return res.status(200).json(createResponse(true, "Email to reset password successfully sent"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(createResponse(false, null, "Internal Server Error"));
  }
};

const resetPasswordController = async (req, res, next) => {
  const { token, userId, newPassword } = req.body;
  try {
    if (!token) return res.status(400).json(createResponse(false, null, "Password reset token not provided"));

    if (!userId || !newPassword)
      return res.status(400).json(createResponse(false, null, "Password or user Id not provided"));

    const existingTokenFromDB = await getTokenByUserId(userId);

    if (!existingTokenFromDB) {
      return res.status(400).json(createResponse(false, null, "Invalid or expired password reset token"));
    }

    const isTokenValid = await bcrypt.compare(token, existingTokenFromDB.token);
    if (!isTokenValid) {
      return res.status(400).json(createResponse(false, null, "Invalid or expired password reset token"));
    }
    validatePasswordStrength(newPassword);

    const hashedNewPassword = await hashPassword(newPassword);
    await updateUserById(userId, { password: hashedNewPassword });

    const user = await getUserById(userId);
    await sendPasswordResetSuccessfullEmail(user.email);

    await deleteTokenByUserId(userId);
    return res.status(200).json(createResponse(true, "Password has been successfully reset"));
  } catch (error) {
    console.error(error);
    if (error.name === "InvalidPasswordFormatError") {
      return res.status(400).json(createResponse(false, null, error.message));
    }
    return res.status(500).json(createResponse(false, null, "Internal Server Error"));
  }
};

const logoutController = (req, res, next) => {
  res.cookie("authToken", "", { httpOnly: true, maxAge: 1, sameSite: "None", secure: true });
  return res.status(200).json(createResponse(true, "Logged out successfully"));
};

module.exports = {
  signupController,
  loginController,
  changePasswordController,
  requestPasswordResetController,
  resetPasswordController,
  logoutController,
};
