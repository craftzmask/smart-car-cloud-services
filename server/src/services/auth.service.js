"use strict";

const UserModel = require("../models/user.model");
const { NotFoundError } = require("../core/error.response");

const login = async ({ username, password }) => {
  const foundUser = await UserModel.findOne({ username, password }).select(
    "username"
  );

  if (!foundUser) {
    throw new NotFoundError("User does not exist!");
  }

  return foundUser;
};

const signup = async ({ username, password }) => {
  return await UserModel.create({ username, password });
};

const AuthService = {
  login,
  signup,
};

module.exports = AuthService;
