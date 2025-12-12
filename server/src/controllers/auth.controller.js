"use strict";

const AuthService = require("../services/auth.service");
const { OK, CREATED } = require("../core/success.response");
const { BadRequestError, AuthFailureError } = require("../core/error.response");

class AuthController {
  async signup(request, response) {
    const { username, password, email, role } = request.body;
    if (!username || !password || !email) {
      throw new BadRequestError("Username, password, and email are required");
    }
    const normalizedRole = typeof role === "string" ? role.toLowerCase().trim() : role;

    const result = await AuthService.signup({
      username,
      password,
      email,
      role: normalizedRole || "user",
    });

    return new CREATED({
      message: result.message || "User created successfully",
      data: result.user,
    }).send(response);
  }

  async login(request, response) {
    const { username, password, loginAs } = request.body;
    if (!username || !password) {
      throw new BadRequestError("Username and password are required");
    }
    if (!loginAs) {
      throw new BadRequestError("loginAs is required");
    }

    const result = await AuthService.login({ username, password, loginAs });
    return new OK({ message: "Login successful", data: result }).send(response);
  }

  async confirm(request, response) {
    const { username, code } = request.body || {};
    if (!username || !code) {
      throw new BadRequestError("Username and code are required");
    }

    const result = await AuthService.confirmSignUp({ username, code });
    return new OK({ message: result.message || "Account confirmed successfully", data: null }).send(response);
  }

  async resend(request, response) {
    const { username } = request.body || {};
    if (!username) {
      throw new BadRequestError("Username is required");
    }

    const result = await AuthService.resendConfirmation({ username });
    return new OK({ message: result.message || "Verification code resent successfully", data: null }).send(response);
  }

  async getProfile(request, response) {
    const requester = request.user;
    if (!requester || !requester.username) {
      throw new AuthFailureError("Authentication required");
    }

    const result = await AuthService.getUserProfile({
      username: requester.username,
      cognitoUsername: requester.cognitoUsername,
      sub: requester.sub,
    });

    return new OK({ message: "Profile retrieved successfully", data: result }).send(response);
  }

  async updateRole(request, response) {
    const { username } = request.params;
    const { role } = request.body;
    if (!role) {
      throw new BadRequestError("Role is required");
    }

    const normalizedRole = typeof role === "string" ? role.toLowerCase().trim() : role;

    const result = await AuthService.updateUserRole(username, normalizedRole);
    return new OK({ message: result.message, data: result.user }).send(response);
  }

  async deactivateUser(request, response) {
    const { username } = request.params;
    const result = await AuthService.deactivateUser(username);
    return new OK({ message: result.message, data: result.user }).send(response);
  }

  async activateUser(request, response) {
    const { username } = request.params;
    const result = await AuthService.activateUser(username);
    return new OK({ message: result.message, data: result.user }).send(response);
  }

  async getActiveUsers(_request, response) {
    const result = await AuthService.getActiveUsers();
    return new OK({ message: "Active users retrieved successfully", data: result }).send(response);
  }

  async getUsersByRole(request, response) {
    const { role } = request.params;
    const result = await AuthService.getUsersByRole(role);
    return new OK({ message: `Users with role '${role}' retrieved successfully`, data: result }).send(response);
  }

  async refresh(request, response) {
    const { refreshToken } = request.body || {};
    if (!refreshToken) {
      throw new BadRequestError("refreshToken is required");
    }
    const result = await AuthService.refreshTokens({ refreshToken });
    return new OK({ message: "Token refreshed", data: result }).send(response);
  }
}

module.exports = new AuthController();
