"use strict";

const AuthService = require("../services/auth.service");
const { OK, CREATED } = require("../core/success.response");

const login = async (req, res) => {
  new OK({
    message: "Login Succesfully",
    metadata: await AuthService.login(req.body),
  }).send(res);
};

const signup = async (req, res) => {
  new CREATED({
    message: "Sign up Successfully",
    metadata: await AuthService.signup(req.body),
  }).send(res);
};

const AuthController = {
  login,
  signup,
};

module.exports = AuthController;
