const { TOKEN_EXPIRATION_IN_SECS } = require("../constants");
const { generateAuthToken } = require("../services/tokenService");
const { addUser, getUserByName, updateUserById, getUserById } = require("../services/userService");
const { createResponse } = require("../utilities");
const { hashPassword, verifyPassword, validatePasswordStrength } = require("../utilities/passwordUtils");

const signupController = async (req, res, next) => {
  const { username, password, role } = req.body;
  try {
    validatePasswordStrength(password);
    const hashedPassword = await hashPassword(password);
    const userData = { username, password: hashedPassword };
    if (role) userData.role = role;

    await addUser(userData);
    return res.status(201).json(createResponse(true, "User signed up successfully.", null));
  } catch (error) {
    console.error(error);
    if (error.name === "MongoServerError" && error.code === 11000) {
      if (error.message.toLowerCase().includes("username"))
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

    const token = generateAuthToken({ _id: user._id, username: user.username, role: user.role });
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: TOKEN_EXPIRATION_IN_SECS * 1000, // 2hrs in ms
    });

    return res.status(200).json(createResponse(true, user, null));
  } catch (error) {
    console.error(error);
    return res.status(500).json(createResponse(false, null, "Internal Server Error"));
  }
};

const resetPassword = async (req, res, next) => {
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

module.exports = { signupController, loginController, resetPassword };
