"use strict";

const User = require("../models/sql/user.model");
const CognitoService = require("./cognito.service");
const {
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ConflictRequestError,
} = require("../core/error.response");

class AuthService {
  // Register a new user
  async signup({ username, password, email, role = "user" }) {
    try {
      // Validate input
      if (!username || !password || !email) {
        throw new BadRequestError("Username, password, and email are required");
      }

      // Validate role
      const validRoles = ["user", "admin", "staff"];
      if (!validRoles.includes(role)) {
        throw new BadRequestError(
          `Invalid role. Must be one of: ${validRoles.join(", ")}`
        );
      }

      // Check if user already exists in local database
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        throw new ConflictRequestError("Username already exists");
      }

      // Check if email already exists
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        throw new ConflictRequestError("Email already exists");
      }

      // Register user in Cognito (includes adding to group)
      const cognitoResult = await CognitoService.signUp({
        username,
        password,
        email,
        role,
      });

      // Save user to local database
      const newUser = await User.create({
        username,
        email,
        role,
        cognitoSub: cognitoResult.userSub,
        emailVerified: cognitoResult.userConfirmed,
      });

      // Auto-confirm user in dev environment
      if ((process.env.NODE_ENV || "").toLowerCase() === "dev") {
        await CognitoService.autoConfirmUser(username);
        newUser.emailVerified = true;
        await newUser.save();
      }

      return {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          cognitoSub: cognitoResult.userSub,
          emailVerified: newUser.emailVerified,
        },
        message: cognitoResult.message,
      };
    } catch (error) {
      // Handle Sequelize unique constraint errors
      if (error.name === "SequelizeUniqueConstraintError") {
        const field = error.errors[0]?.path || "field";
        throw new ConflictRequestError(`${field} already exists`);
      }
      throw error;
    }
  }

  // Authenticate user credentials
  async login({ username, password }) {
    try {
      if (!username || !password) {
        throw new BadRequestError("Username and password are required");
      }

      // Authenticate with Cognito
      const cognitoResult = await CognitoService.login({ username, password });

      // Find or create user in local database
      let localUser = await User.findByUsername(username);

      if (!localUser) {
        // Create user if doesn't exist (sync from Cognito)
        localUser = await User.create({
          username: cognitoResult.user.username,
          email: cognitoResult.user.email,
          role: cognitoResult.user.role,
          cognitoSub: cognitoResult.user.username,
          emailVerified: cognitoResult.user.emailVerified,
        });
      }

      // Update last login
      await localUser.updateLastLogin();

      return {
        tokens: {
          accessToken: cognitoResult.accessToken,
          idToken: cognitoResult.idToken,
          refreshToken: cognitoResult.refreshToken,
          expiresIn: cognitoResult.expiresIn,
          tokenType: cognitoResult.tokenType,
        },
        user: {
          id: localUser.id,
          username: localUser.username,
          email: localUser.email,
          role: cognitoResult.user.role,
          groups: cognitoResult.user.groups,
          emailVerified: cognitoResult.user.emailVerified,
          lastLogin: localUser.lastLogin,
        },
      };
    } catch (error) {
      if (error.name === "NotAuthorizedException") {
        throw new AuthFailureError("Invalid username or password");
      }
      if (error.name === "UserNotConfirmedException") {
        throw new AuthFailureError(
          "Please verify your email before logging in"
        );
      }
      throw error;
    }
  }

  // Retrieve user profile information
  async getUserProfile(input) {
    try {
      const lookup =
        typeof input === "string" ? { username: input } : input || {};
      const username = (
        lookup.username ||
        lookup.cognitoUsername ||
        ""
      ).toLowerCase();

      if (!username) {
        throw new BadRequestError("Username is required");
      }

      const cognitoKey = lookup.cognitoUsername || username;
      const cognitoPromise = CognitoService.getUserDetails(cognitoKey);

      let localUser = await User.findByUsername(username);
      console.log("localUser:", localUser);
      if (!localUser && lookup.sub) {
        localUser = await User.findByCognitoSub(lookup.sub);
      }

      if (!localUser) {
        throw new NotFoundError("User not found in database");
      }

      const cognitoUser = await cognitoPromise;

      return {
        username: cognitoUser.username,
        email: cognitoUser.email,
        role: cognitoUser.primaryRole,
        groups: cognitoUser.groups,
        emailVerified: cognitoUser.emailVerified,
        userStatus: cognitoUser.userStatus,
        localUser,
      };
    } catch (error) {
      throw error;
    }
  }

  // Update a user's role
  async updateUserRole(username, newRole) {
    try {
      // Validate role
      const validRoles = ["user", "admin", "staff"];
      if (!validRoles.includes(newRole)) {
        throw new BadRequestError(
          `Invalid role. Must be one of: ${validRoles.join(", ")}`
        );
      }

      // Update in Cognito
      const cognitoResult = await CognitoService.updateUserRole(
        username,
        newRole
      );

      // Update in local database
      const localUser = await User.findByUsername(username);

      if (!localUser) {
        throw new NotFoundError("User not found in database");
      }

      localUser.role = newRole;
      await localUser.save();

      return {
        message: cognitoResult.message,
        user: {
          id: localUser.id,
          username: localUser.username,
          email: localUser.email,
          role: localUser.role,
        },
        previousGroups: cognitoResult.previousGroups,
      };
    } catch (error) {
      throw error;
    }
  }

  // List users with optional filters
  async getAllUsers({ page = 1, limit = 10, role = null, isActive = null }) {
    try {
      const where = {};

      if (role) {
        where.role = role;
      }

      if (isActive !== null) {
        where.isActive = isActive;
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await User.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        attributes: { exclude: [] },
      });

      return {
        users: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Deactivate a user account
  async deactivateUser(username) {
    try {
      const user = await User.findByUsername(username);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      await user.deactivate();

      return {
        message: "User deactivated successfully",
        user: {
          id: user.id,
          username: user.username,
          isActive: user.isActive,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Activate a user account
  async activateUser(username) {
    try {
      const user = await User.findByUsername(username);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      await user.activate();

      return {
        message: "User activated successfully",
        user: {
          id: user.id,
          username: user.username,
          isActive: user.isActive,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
