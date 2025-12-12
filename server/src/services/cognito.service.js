"use strict";

const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  AdminConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  AdminAddUserToGroupCommand,
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
  AdminRemoveUserFromGroupCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const crypto = require("crypto");

const ALLOWED_ROLES = ["car_owner", "iot_team", "staff"];

const buildConfigError = (message) => {
  const error = new Error(message);
  error.name = "InvalidConfiguration";
  error.statusCode = 500;
  error.status = 500;
  return error;
};

class CognitoService {
  constructor() {
    this.client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
    this.userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
    const rawClientId = process.env.AWS_COGNITO_CLIENT_ID;
    this.clientId =
      typeof rawClientId === "string"
        ? rawClientId.trim() || undefined
        : rawClientId;
    this.clientSecret = process.env.AWS_COGNITO_CLIENT_SECRET;
    this.availableGroups = ALLOWED_ROLES;
    this.tokenVerifiers = this.initializeTokenVerifiers();
  }

  ensureClientConfigured() {
    if (!this.userPoolId) {
      throw buildConfigError("Cognito userPoolId is not configured");
    }
    if (!this.clientId) {
      throw buildConfigError("Cognito ClientId is not configured");
    }
  }

  ensureValidRole(role) {
    const normalized =
      typeof role === "string" ? role.toLowerCase().trim() : role;
    if (!this.availableGroups.includes(normalized)) {
      throw new Error(
        `Invalid role. Must be one of: ${this.availableGroups.join(", ")}`
      );
    }
    return normalized;
  }

  generateSecretHash(username) {
    if (!this.clientSecret) return undefined;
    return crypto
      .createHmac("SHA256", this.clientSecret)
      .update(username + this.clientId)
      .digest("base64");
  }

  initializeTokenVerifiers() {
    if (!this.userPoolId) return null;

    const verifierClientId =
      typeof this.clientId === "string" ? this.clientId.trim() : this.clientId;
    return {
      id: verifierClientId
        ? CognitoJwtVerifier.create({
            userPoolId: this.userPoolId,
            tokenUse: "id",
            clientId: verifierClientId,
          })
        : null,
      access: CognitoJwtVerifier.create({
        userPoolId: this.userPoolId,
        tokenUse: "access",
        clientId: null,
      }),
    };
  }

  async decodeToken(token) {
    if (!token) throw new Error("Authorization token is required");
    if (!this.tokenVerifiers)
      throw new Error("Cognito token verifiers are not configured");

    const attempts = [
      { use: "id", verifier: this.tokenVerifiers.id },
      { use: "access", verifier: this.tokenVerifiers.access },
    ];

    let lastError = null;

    for (const attempt of attempts) {
      if (!attempt.verifier) continue;
      try {
        const payload = await attempt.verifier.verify(token);
        return { payload, tokenUse: attempt.use };
      } catch (error) {
        lastError = error;
      }
    }

    const err = new Error("Invalid or expired token");
    err.cause = lastError;
    throw err;
  }

  async signUp({ username, password, email, role = "user" }) {
    this.ensureClientConfigured();
    const normalizedRole = this.ensureValidRole(role);

    const params = {
      ClientId: this.clientId,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
    };

    const secretHash = this.generateSecretHash(username);
    if (secretHash) params.SecretHash = secretHash;

    try {
      const command = new SignUpCommand(params);
      const response = await this.client.send(command);
      await this.addUserToGroup(username, normalizedRole);

      return {
        userSub: response.UserSub,
        username,
        email,
        role: normalizedRole,
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
    this.ensureClientConfigured();

    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    const secretHash = this.generateSecretHash(username);
    if (secretHash) params.AuthParameters.SECRET_HASH = secretHash;

    try {
      const command = new InitiateAuthCommand(params);
      const response = await this.client.send(command);
      if (!response.AuthenticationResult)
        throw new Error("Authentication failed");

      const userDetails = await this.getUserDetails(username);

      return {
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
        expiresIn: response.AuthenticationResult.ExpiresIn,
        tokenType: response.AuthenticationResult.TokenType,
        user: {
          username,
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

  async refreshTokens(refreshToken) {
    this.ensureClientConfigured();
    if (!refreshToken) {
      const err = new Error("refreshToken is required");
      err.name = "BadRequestError";
      throw err;
    }

    const params = {
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };

    const secretHash = this.generateSecretHash("refresh-token");
    if (secretHash) params.AuthParameters.SECRET_HASH = secretHash;

    try {
      const command = new InitiateAuthCommand(params);
      const response = await this.client.send(command);
      if (!response.AuthenticationResult) {
        throw new Error("Token refresh failed");
      }

      return {
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        expiresIn: response.AuthenticationResult.ExpiresIn,
        tokenType: response.AuthenticationResult.TokenType,
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

      const attributes = userResponse.UserAttributes.reduce((acc, attr) => {
        acc[attr.Name.replace("custom:", "")] = attr.Value;
        return acc;
      }, {});

      const primaryRole =
        groups.length > 0
          ? groups.sort((a, b) => a.Precedence - b.Precedence)[0].GroupName
          : "user";

      return {
        username: userResponse.Username,
        email: attributes.email,
        groups: groups.map((g) => g.GroupName),
        primaryRole,
        emailVerified: attributes.email_verified === "true",
        userStatus: userResponse.UserStatus,
      };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async updateUserRole(username, newRole) {
    const normalizedRole = this.ensureValidRole(newRole);

    try {
      const currentGroups = await this.getUserGroups(username);
      for (const group of currentGroups) {
        await this.removeUserFromGroup(username, group.GroupName);
      }
      await this.addUserToGroup(username, normalizedRole);

      return {
        message: "User role updated successfully",
        username,
        newRole: normalizedRole,
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
    customError.status = customError.statusCode;
    customError.details = error.message;

    return customError;
  }

  async confirmSignUp({ username, code }) {
    this.ensureClientConfigured();

    const params = {
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: code,
    };

    const secretHash = this.generateSecretHash(username);
    if (secretHash) params.SecretHash = secretHash;

    try {
      const command = new ConfirmSignUpCommand(params);
      await this.client.send(command);
      return { message: "Account confirmed successfully" };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async resendConfirmationCode({ username }) {
    this.ensureClientConfigured();

    const params = {
      ClientId: this.clientId,
      Username: username,
    };

    const secretHash = this.generateSecretHash(username);
    if (secretHash) params.SecretHash = secretHash;

    try {
      const command = new ResendConfirmationCodeCommand(params);
      const response = await this.client.send(command);
      return {
        message: "Verification code resent successfully",
        delivery: response.CodeDeliveryDetails || null,
      };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }
}

module.exports = new CognitoService();
