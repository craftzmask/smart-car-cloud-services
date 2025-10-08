const UserModel = require("../models/user.model");
const { NotFoundError } = require("../core/error.response");

const singup = async ({ username, password }) => {
  const createdUser = await UserModel.create({
    username,
    password,
  });

  return createdUser;
};

const login = async ({ username, password }) => {
  const foundUser = await UserModel.findOne({
    username,
    password,
  });

  if (!foundUser) {
    throw new NotFoundError("User not found");
  }

  return foundUser;
};

const AuthService = {
  singup,
  login,
};

module.exports = AuthService;
