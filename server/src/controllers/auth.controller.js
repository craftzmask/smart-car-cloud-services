const AuthService = require("../services/auth.service");
const { OK, CREATED } = require("../core/success.response");

const login = async (request, response) => {
  return new OK({
    message: "Login Succesffully",
    data: await AuthService.login(request.body),
  }).send(response);
};

const signup = async (request, response) => {
  return new CREATED({
    message: "Created successfully",
    data: await AuthService.singup(request.body),
  }).send(response);
};

const AuthController = {
  login,
  signup,
};

module.exports = AuthController;
