const { verifyAuthToken } = require("../utilities/tokenUtils");
const { createResponse } = require("../utilities");
const { USER_TYPE_ROLES } = require("../constants");

const adminAuth = (req, res, next) => {
  const token = req.cookies?.authToken;
  if (!token) {
    return res.status(401).json(createResponse(false, null, "Token not provided"));
  }

  console.log("Verifying token");

  verifyAuthToken(token, (err, decodedToken) => {
    if (err) {
      return res.status(400).json(createResponse(false, null, "Invalid token or expired."));
    }

    if (!decodedToken) {
      return res.status(403).json(createResponse(false, null, "Not authorized"));
    }

    console.log("Decoded token:");
    console.log(decodedToken);
    if (decodedToken.role !== USER_TYPE_ROLES.ADMIN)
      return res.status(403).json(createResponse(false, null, "Not authorized"));

    req.userId = decodedToken._id;
    next();
  });
};

module.exports = adminAuth;
