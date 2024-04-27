const jwt = require("jsonwebtoken");
const { TOKEN_EXPIRATION_IN_SECS } = require("../constants");

const generateAuthToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.SECRET_STRING, { expiresIn: TOKEN_EXPIRATION_IN_SECS });
    return token;
  } catch (error) {
    console.error("Error occurred during token signing:", error);
    throw error;
  }
};

module.exports = { generateAuthToken };
