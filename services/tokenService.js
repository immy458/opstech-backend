const token = require("../models/token");

const addToken = async (tokenData) => {
  return await token.create(tokenData);
};

const getTokenByUserId = async (userId) => {
  return await token.findOne({ userId });
};

const deleteTokenByUserId = async (userId) => {
  return await token.deleteOne({ userId });
};

module.exports = { getTokenByUserId, deleteTokenByUserId, addToken };
