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

const verifyAuthToken = (token, callback) => {
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_STRING);
    callback(null, decodedToken);
  } catch (error) {
    console.error("Error while verifying token:", error);
    callback(error);
  }
};

module.exports = { generateAuthToken, verifyAuthToken };
