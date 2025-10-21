"use strict";

const AuthService = require("../services/auth.service");
const { OK, CREATED } = require("../core/success.response");
const { BadRequestError, AuthFailureError } = require("../core/error.response");

class AuthController {
  /**
   * User signup
   * Public endpoint - no authentication required
   * POST /api/v1/signup
   */
  async signup(request, response) {
    const { username, password, email, role } = request.body;

    // Validate required fields
    if (!username || !password || !email) {
      throw new BadRequestError("Username, password, and email are required");
    }

    const result = await AuthService.signup({
      username,
      password,
      email,
      role: role || "user",
    });

    return new CREATED({
      message: result.message || "User created successfully",
      data: result.user,
    }).send(response);
  }

  /**
   * User login
   * Public endpoint - no authentication required
   * POST /api/v1/login
   */
  async login(request, response) {
    const { username, password } = request.body;

    // Validate required fields
    if (!username || !password) {
      throw new BadRequestError("Username and password are required");
    }

    const result = await AuthService.login({ username, password });

    return new OK({
      message: "Login successful",
      data: result,
    }).send(response);
  }

  /**
   * Get authenticated user profile
   * Protected endpoint - requires authentication
   * GET /api/v1/profile
   */
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

    return new OK({
      message: "Profile retrieved successfully",
      data: result,
    }).send(response);
  }

  /**
   * Update user role
   * Protected endpoint - requires authentication
   * API Gateway ensures ONLY ADMINS can access this endpoint
   * PATCH /api/v1/role/:username
   */
  async updateRole(request, response) {
    const { username } = request.params;
    const { role } = request.body;
    
    if (!role) {
      throw new BadRequestError("Role is required");
    }

    const result = await AuthService.updateUserRole(username, role);

    return new OK({
      message: result.message,
      data: result.user,
    }).send(response);
  }

  /**
   * Deactivate user account
   * Protected endpoint - requires admin authentication
   * PATCH /api/v1/users/:username/deactivate
   */
  async deactivateUser(request, response) {
    const { username } = request.params;

    const result = await AuthService.deactivateUser(username);

    return new OK({
      message: result.message,
      data: result.user,
    }).send(response);
  }

  /**
   * Activate user account
   * Protected endpoint - requires admin authentication
   * PATCH /api/v1/users/:username/activate
   */
  async activateUser(request, response) {
    const { username } = request.params;

    const result = await AuthService.activateUser(username);

    return new OK({
      message: result.message,
      data: result.user,
    }).send(response);
  }

  /**
   * Get all active users
   * Protected endpoint - requires admin authentication
   * GET /api/v1/users/active
   */
  async getActiveUsers(request, response) {
    const result = await AuthService.getActiveUsers();

    return new OK({
      message: "Active users retrieved successfully",
      data: result,
    }).send(response);
  }

  /**
   * Get users by role
   * Protected endpoint - requires admin authentication
   * GET /api/v1/users/role/:role
   */
  async getUsersByRole(request, response) {
    const { role } = request.params;

    const result = await AuthService.getUsersByRole(role);

    return new OK({
      message: `Users with role '${role}' retrieved successfully`,
      data: result,
    }).send(response);
  }
}

module.exports = new AuthController();
