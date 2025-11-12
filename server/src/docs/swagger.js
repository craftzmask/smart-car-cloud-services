"use strict";

const { version } = require("../../package.json");

const servers = [
  {
    url: "http://localhost:8080/api/v1",
    description: "Local development",
  },
];

const components = {
  schemas: {
    SignupRequest: {
      type: "object",
      required: ["username", "password", "email"],
      properties: {
        username: {
          type: "string",
          description: "Username the user will sign in with (distinct from email)",
          example: "alice",
        },
        password: {
          type: "string",
          format: "password",
          description: "Password that complies with the Cognito password policy",
          example: "P@ssw0rd!",
        },
        email: {
          type: "string",
          format: "email",
          description: "User email address",
          example: "alice@example.com",
        },
        role: {
          type: "string",
          description: "Optional initial role to assign (default: user)",
          enum: ["user", "admin", "staff"],
          example: "user",
        },
      },
    },
    SignupResponse: {
      type: "object",
      properties: {
        message: { type: "string", example: "User registered successfully. Please verify your email." },
        status: { type: "integer", example: 201 },
        data: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            username: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string" },
            cognitoSub: { type: "string", description: "Cognito user sub" },
            emailVerified: { type: "boolean" },
          },
        },
      },
    },
    LoginRequest: {
      type: "object",
      required: ["username", "password"],
      properties: {
        username: {
          type: "string",
          description: "Username used during signup (not email)",
          example: "alice",
        },
        password: {
          type: "string",
          format: "password",
          example: "P@ssw0rd!",
        },
      },
    },
    LoginResponse: {
      type: "object",
      properties: {
        message: { type: "string", example: "Login successful" },
        status: { type: "integer", example: 200 },
        data: {
          type: "object",
          properties: {
            tokens: {
              type: "object",
              properties: {
                accessToken: { type: "string" },
                idToken: { type: "string" },
                refreshToken: { type: "string" },
                expiresIn: { type: "integer", example: 3600 },
                tokenType: { type: "string", example: "Bearer" },
              },
            },
            user: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                username: { type: "string" },
                email: { type: "string", format: "email" },
                role: { type: "string" },
                groups: {
                  type: "array",
                  items: { type: "string" },
                },
                emailVerified: { type: "boolean" },
                lastLogin: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
    ConfirmSignupRequest: {
      type: "object",
      required: ["username", "code"],
      properties: {
        username: {
          type: "string",
          description: "Username used during signup (or email if pool uses email sign-in)",
          example: "alice",
        },
        code: {
          type: "string",
          description: "Verification code received via email",
          example: "123456",
        },
      },
    },
    ResendConfirmationRequest: {
      type: "object",
      required: ["username"],
      properties: {
        username: {
          type: "string",
          description: "Username used during signup (or email if pool uses email sign-in)",
          example: "alice",
        },
      },
    },
    ErrorResponse: {
      type: "object",
      properties: {
        status: { type: "string", example: "Error" },
        code: { type: "integer", example: 400 },
        message: { type: "string", example: "Username and password are required" },
      },
    },
    HealthResponse: {
      type: "object",
      properties: {
        status: { type: "string", example: "OK" },
        message: { type: "string", example: "Server is running" },
        timestamp: { type: "string", format: "date-time" },
        environment: { type: "string", example: "dev" },
      },
    },
  },
};

const paths = {
  "/auth/signup": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/SignupRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignupResponse" },
            },
          },
        },
        400: {
          description: "Validation or business rule failure",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        409: {
          description: "Username or email already exists",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Authenticate user credentials",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginResponse" },
            },
          },
        },
        400: {
          description: "Missing username or password",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        401: {
          description: "Invalid credentials or unverified user",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/health": {
    get: {
      tags: ["System"],
      summary: "API health check",
      responses: {
        200: {
          description: "Service is reachable",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HealthResponse" },
            },
          },
        },
      },
    },
  },
};

module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Smart Car Cloud Services API",
    version,
    description:
      "REST API powering smart car cloud services. This documentation covers the available HTTP endpoints exposed by the Node.js server.",
    contact: {
      name: "Smart Car Cloud Team",
    },
  },
  servers,
  tags: [
    { name: "Auth", description: "Authentication and user management" },
    { name: "System", description: "Service utilities" },
  ],
  components,
  paths,
};
