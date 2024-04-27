const bcrypt = require("bcryptjs");

const InvalidPasswordFormatError = require("../Exceptions");

const hashPassword = async (password) => {
  try {
    console.log("Hashing Password");
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
    return hashedPassword;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const validatePasswordStrength = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:'",/?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new InvalidPasswordFormatError(
      "Password must contain at least 8 characters, including uppercase and lowercase letters, a number, and a special character."
    );
  }
  return true;
};

const isPasswordValid = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword);
};

module.exports = { validatePasswordStrength, hashPassword, isPasswordValid };
