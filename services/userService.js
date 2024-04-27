const user = require("../models/user");

const addUser = async (userData) => {
  return await user.create(userData);
};

const getUserByName = async (username) => {
  return await user.findOne({ username });
};

module.exports = { addUser, getUserByName };
