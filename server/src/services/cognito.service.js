"use strict";

const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  AdminConfirmSignUpCommand,
  AdminAddUserToGroupCommand,
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
  CreateGroupCommand,
  ListGroupsCommand,
  AdminRemoveUserFromGroupCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const crypto = require("crypto");

class CognitoService {
  constructor() {
    this.client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
    this.userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
    this.clientId = process.env.AWS_COGNITO_CLIENT_ID;
    this.clientSecret = process.env.AWS_COGNITO_CLIENT_SECRET;

    this.availableGroups = ["user", "admin", "staff"];
  }

  generateSecretHash(username) {
    if (!this.clientSecret) return undefined;

    return crypto
      .createHmac("SHA256", this.clientSecret)
      .update(username + this.clientId)
      .digest("base64");
  }

  async initializeGroups() {
    try {
      const existingGroups = await this.listGroups();
      const existingGroupNames = existingGroups.map((g) => g.GroupName);

      const groupConfigs = [
        {
          GroupName: "admin",
          Description: "Administrator with full access",
          Precedence: 1,
        },
        {
          GroupName: "staff",
          Description: "Staff members with limited admin access",
          Precedence: 2,
        },
        {
          GroupName: "user",
          Description: "Regular users",
          Precedence: 3,
        },
      ];

      const created = [];
      for (const config of groupConfigs) {
        if (!existingGroupNames.includes(config.GroupName)) {
          await this.createGroup(config);
          created.push(config.GroupName);
        }
      }

      return {
        message: "Groups initialized successfully",
        created,
        existing: existingGroupNames,
      };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async createGroup({ GroupName, Description, Precedence }) {
    try {
      const command = new CreateGroupCommand({
        UserPoolId: this.userPoolId,
        GroupName,
        Description,
        Precedence,
      });

      const response = await this.client.send(command);
      return response.Group;
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async listGroups() {
    try {
      const command = new ListGroupsCommand({
        UserPoolId: this.userPoolId,
      });

      const response = await this.client.send(command);
      return response.Groups || [];
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async signUp({ username, password, email, role = "user" }) {
    if (!this.availableGroups.includes(role)) {
      throw new Error(
        `Invalid role. Must be one of: ${this.availableGroups.join(", ")}`
      );
    }

    const params = {
      ClientId: this.clientId,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    };

    const secretHash = this.generateSecretHash(username);
    if (secretHash) {
      params.SecretHash = secretHash;
    }

    try {
      // Create user
      const command = new SignUpCommand(params);
      const response = await this.client.send(command);

      // Add user to group
      await this.addUserToGroup(username, role);

      return {
        userSub: response.UserSub,
        username: username,
        email: email,
        role: role,
        userConfirmed: response.UserConfirmed,
        message: "User registered successfully. Please verify your email.",
      };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async addUserToGroup(username, groupName) {
    try {
      const command = new AdminAddUserToGroupCommand({
        UserPoolId: this.userPoolId,
        Username: username,
        GroupName: groupName,
      });

      await this.client.send(command);
      return { message: `User added to group: ${groupName}` };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async removeUserFromGroup(username, groupName) {
    try {
      const command = new AdminRemoveUserFromGroupCommand({
        UserPoolId: this.userPoolId,
        Username: username,
        GroupName: groupName,
      });

      await this.client.send(command);
      return { message: `User removed from group: ${groupName}` };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async getUserGroups(username) {
    try {
      const command = new AdminListGroupsForUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });

      const response = await this.client.send(command);
      return response.Groups || [];
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async autoConfirmUser(username) {
    try {
      const command = new AdminConfirmSignUpCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });

      await this.client.send(command);
      return { message: "User confirmed successfully" };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async login({ username, password }) {
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    const secretHash = this.generateSecretHash(username);
    if (secretHash) {
      params.AuthParameters.SECRET_HASH = secretHash;
    }

    try {
      const command = new InitiateAuthCommand(params);
      const response = await this.client.send(command);

      if (!response.AuthenticationResult) {
        throw new Error("Authentication failed");
      }

      const userDetails = await this.getUserDetails(username);

      return {
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
        expiresIn: response.AuthenticationResult.ExpiresIn,
        tokenType: response.AuthenticationResult.TokenType,
        user: {
          username: username,
          email: userDetails.email,
          groups: userDetails.groups,
          role: userDetails.primaryRole,
          emailVerified: userDetails.emailVerified,
        },
      };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async getUserDetails(username) {
    try {
      const userCommand = new AdminGetUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });

      const userResponse = await this.client.send(userCommand);
      const groups = await this.getUserGroups(username);

      const attributes = {};
      userResponse.UserAttributes.forEach((attr) => {
        const key = attr.Name.replace("custom:", "");
        attributes[key] = attr.Value;
      });

      let primaryRole = "user";
      if (groups.length > 0) {
        const sortedGroups = groups.sort((a, b) => a.Precedence - b.Precedence);
        primaryRole = sortedGroups[0].GroupName;
      }

      return {
        username: userResponse.Username,
        email: attributes.email,
        groups: groups.map((g) => g.GroupName),
        primaryRole: primaryRole,
        emailVerified: attributes.email_verified === "true",
        userStatus: userResponse.UserStatus,
      };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async updateUserRole(username, newRole) {
    if (!this.availableGroups.includes(newRole)) {
      throw new Error(
        `Invalid role. Must be one of: ${this.availableGroups.join(", ")}`
      );
    }

    try {
      const currentGroups = await this.getUserGroups(username);

      for (const group of currentGroups) {
        await this.removeUserFromGroup(username, group.GroupName);
      }

      await this.addUserToGroup(username, newRole);

      return {
        message: "User role updated successfully",
        username: username,
        newRole: newRole,
        previousGroups: currentGroups.map((g) => g.GroupName),
      };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  handleCognitoError(error) {
    const errorMap = {
      UsernameExistsException: "Username already exists",
      InvalidPasswordException: "Password does not meet requirements",
      InvalidParameterException: "Invalid parameters provided",
      NotAuthorizedException: "Invalid username or password",
      UserNotFoundException: "User not found",
      UserNotConfirmedException: "User email not verified",
      TooManyRequestsException: "Too many requests, please try again later",
      CodeMismatchException: "Invalid verification code",
      ExpiredCodeException: "Verification code has expired",
      ResourceNotFoundException: "Group not found",
    };

    const message =
      errorMap[error.name] || error.message || "Authentication error";

    const customError = new Error(message);
    customError.name = error.name;
    customError.statusCode = error.$metadata?.httpStatusCode || 400;

    return customError;
  }
}

module.exports = new CognitoService();