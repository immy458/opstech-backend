const user = require("../models/user");

const addUser = async (userData) => {
  return await user.create(userData);
};

const getUserByName = async (username) => {
  return await user.findOne({ username });
};

const getUserById = async (_id) => {
  return await user.findById(_id);
};

const updateUserById = async (_id, data) => {
  return await user.findByIdAndUpdate({ _id }, data, { new: true });
};

module.exports = { addUser, getUserByName, getUserById, updateUserById };
