"use strict";

const {version} = require("../../package.json");

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
                message: {type: "string", example: "User registered successfully. Please verify your email."},
                status: {type: "integer", example: 201},
                data: {
                    type: "object",
                    properties: {
                        id: {type: "string", format: "uuid"},
                        username: {type: "string"},
                        email: {type: "string", format: "email"},
                        role: {type: "string"},
                        cognitoSub: {type: "string", description: "Cognito user sub"},
                        emailVerified: {type: "boolean"},
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
                message: {type: "string", example: "Login successful"},
                status: {type: "integer", example: 200},
                data: {
                    type: "object",
                    properties: {
                        tokens: {
                            type: "object",
                            properties: {
                                accessToken: {type: "string"},
                                idToken: {type: "string"},
                                refreshToken: {type: "string"},
                                expiresIn: {type: "integer", example: 3600},
                                tokenType: {type: "string", example: "Bearer"},
                            },
                        },
                        user: {
                            type: "object",
                            properties: {
                                id: {type: "string", format: "uuid"},
                                username: {type: "string"},
                                email: {type: "string", format: "email"},
                                role: {type: "string"},
                                groups: {
                                    type: "array",
                                    items: {type: "string"},
                                },
                                emailVerified: {type: "boolean"},
                                lastLogin: {type: "string", format: "date-time"},
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
        // --- Car Schemas ---
        Car: {
            type: "object",
            properties: {
                id: {type: "string", format: "uuid", example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"},
                vin: {type: "string", example: "1HGCM82633A004352"},
                make: {type: "string", example: "Honda"},
                model: {type: "string", example: "Accord"},
                year: {type: "integer", example: 2023},
                registrationDate: {type: "string", format: "date-time"},
                status: {
                    type: "string",
                    enum: ["active", "inactive", "maintenance", "decommissioned"],
                    example: "active"
                },
                userId: {type: "string", format: "uuid", description: "Owner ID"},
                createdAt: {type: "string", format: "date-time"},
                updatedAt: {type: "string", format: "date-time"},
                owner: {
                    type: "object",
                    properties: {
                        id: {type: "string", format: "uuid"},
                        username: {type: "string"},
                        email: {type: "string"}
                    }
                }
            },
        },
        CarInput: {
            type: "object",
            required: ["vin", "make", "model", "year", "userId"],
            properties: {
                vin: {type: "string", description: "Unique 17-character VIN", example: "1HGCM82633A004352"},
                make: {type: "string", example: "Honda"},
                model: {type: "string", example: "Accord"},
                year: {type: "integer", example: 2023},
                registrationDate: {type: "string", format: "date", example: "2023-05-20"},
                userId: {type: "string", format: "uuid", description: "ID of the existing user who owns the car"},
            },
        },
        CarResponse: {
            type: "object",
            properties: {
                message: {type: "string", example: "Car retrieved successfully"},
                status: {type: "integer", example: 200},
                data: {$ref: "#/components/schemas/Car"},
            },
        },
        CarListResponse: {
            type: "object",
            properties: {
                message: {type: "string", example: "Cars retrieved successfully"},
                status: {type: "integer", example: 200},
                data: {
                    type: "object",
                    properties: {
                        cars: {
                            type: "array",
                            items: {$ref: "#/components/schemas/Car"},
                        },
                        pagination: {
                            type: "object",
                            properties: {
                                total: {type: "integer"},
                                page: {type: "integer"},
                                limit: {type: "integer"},
                                totalPages: {type: "integer"},
                            },
                        },
                    },
                },
            },
        },
        // --- Service Configuration Schemas ---
        ServiceConfiguration: {
            type: "object",
            properties: {
                id: {type: "string", format: "uuid"},
                userId: {type: "string", format: "uuid"},
                notificationMethods: {
                    type: "array",
                    items: {type: "string"},
                    example: ["email", "sms", "push"]
                },
                alertTypes: {
                    type: "array",
                    items: {type: "string"},
                    example: ["engine_warning", "battery_low"]
                },
                createdAt: {type: "string", format: "date-time"},
                updatedAt: {type: "string", format: "date-time"}
            }
        },
        ServiceConfigurationUpdateInput: {
            type: "object",
            properties: {
                notificationMethods: {
                    type: "array",
                    items: {type: "string"},
                    example: ["email"]
                },
                alertTypes: {
                    type: "array",
                    items: {type: "string"},
                    example: ["collision_detected"]
                }
            }
        },
        ServiceConfigurationResponse: {
            type: "object",
            properties: {
                message: {type: "string", example: "Service configuration retrieved successfully"},
                status: {type: "integer", example: 200},
                data: {$ref: "#/components/schemas/ServiceConfiguration"}
            }
        },
        // --- Subscription Schemas ---
        Subscription: {
            type: "object",
            properties: {
                id: {type: "string", format: "uuid"},
                userId: {type: "string", format: "uuid"},
                notificationTypes: {
                    type: "array",
                    items: {type: "string"},
                    example: ["email", "sms"]
                },
                alertTypes: {
                    type: "array",
                    items: {type: "string"},
                    example: ["engine_warning", "battery_low"]
                },
                createdAt: {type: "string", format: "date-time"},
                updatedAt: {type: "string", format: "date-time"}
            }
        },
        SubscriptionInput: {
            type: "object",
            required: ["userId"],
            properties: {
                userId: {type: "string", format: "uuid"},
                notificationTypes: {
                    type: "array",
                    items: {type: "string"},
                    example: ["email"]
                },
                alertTypes: {
                    type: "array",
                    items: {type: "string"},
                    example: ["engine_warning", "collision_detected"]
                }
            }
        },
        SubscriptionUpdateInput: {
            type: "object",
            properties: {
                notificationTypes: {
                    type: "array",
                    items: {type: "string"},
                    example: ["email", "sms"]
                },
                alertTypes: {
                    type: "array",
                    items: {type: "string"},
                    example: ["engine_warning", "battery_low", "collision_detected"]
                }
            }
        },
        SubscriptionResponse: {
            type: "object",
            properties: {
                message: {type: "string", example: "Subscription retrieved successfully"},
                status: {type: "integer", example: 200},
                data: {$ref: "#/components/schemas/Subscription"}
            }
        },
        SubscriptionListResponse: {
            type: "object",
            properties: {
                message: {type: "string", example: "Subscriptions retrieved successfully"},
                status: {type: "integer", example: 200},
                data: {
                    type: "object",
                    properties: {
                        subscriptions: {
                            type: "array",
                            items: {$ref: "#/components/schemas/Subscription"},
                        },
                        pagination: {
                            type: "object",
                            properties: {
                                total: {type: "integer"},
                                page: {type: "integer"},
                                limit: {type: "integer"},
                                totalPages: {type: "integer"},
                            },
                        },
                    },
                },
            },
        },
        // --- Ingestion Schemas ---
        IngestionResponse: {
            type: "object",
            properties: {
                message: {type: "string", example: "Audio ingested and processed successfully"},
                status: {type: "integer", example: 200},
                data: {
                    type: "object",
                    properties: {
                        eventId: {type: "string", example: "692bd615906bfca621d82ba7"},
                        storagePath: {type: "string", example: "/uploads/1764480533230_audio.wav"},
                        classification: {
                            type: "object",
                            description: "ML model classification results",
                            properties: {
                                predictedClass: {type: "string", example: "collision_sounds"},
                                confidence: {type: "number", example: 0.9945},
                                probabilities: {type: "object"}
                            }
                        },
                        metadata: {
                            type: "object",
                            properties: {
                                carId: {type: "string", format: "uuid"},
                                deviceId: {type: "string"},
                                timestamp: {type: "string", format: "date-time"},
                                location: {type: "string"},
                                speed: {type: "number"},
                                rate: {type: "string"}
                            }
                        }
                    }
                }
            }
        },
        ErrorResponse: {
            type: "object",
            properties: {
                status: {type: "string", example: "Error"},
                code: {type: "integer", example: 400},
                message: {type: "string", example: "Username and password are required"},
            },
        },
        HealthResponse: {
            type: "object",
            properties: {
                status: {type: "string", example: "OK"},
                message: {type: "string", example: "Server is running"},
                timestamp: {type: "string", format: "date-time"},
                environment: {type: "string", example: "dev"},
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
                        schema: {$ref: "#/components/schemas/SignupRequest"},
                    },
                },
            },
            responses: {
                201: {
                    description: "User created successfully",
                    content: {
                        "application/json": {
                            schema: {$ref: "#/components/schemas/SignupResponse"},
                        },
                    },
                },
                400: {
                    description: "Validation or business rule failure",
                    content: {
                        "application/json": {
                            schema: {$ref: "#/components/schemas/ErrorResponse"},
                        },
                    },
                },
                409: {
                    description: "Username or email already exists",
                    content: {
                        "application/json": {
                            schema: {$ref: "#/components/schemas/ErrorResponse"},
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
                        schema: {$ref: "#/components/schemas/LoginRequest"},
                    },
                },
            },
            responses: {
                200: {
                    description: "Login successful",
                    content: {
                        "application/json": {
                            schema: {$ref: "#/components/schemas/LoginResponse"},
                        },
                    },
                },
                400: {
                    description: "Missing username or password",
                    content: {
                        "application/json": {
                            schema: {$ref: "#/components/schemas/ErrorResponse"},
                        },
                    },
                },
                401: {
                    description: "Invalid credentials or unverified user",
                    content: {
                        "application/json": {
                            schema: {$ref: "#/components/schemas/ErrorResponse"},
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
                            schema: {$ref: "#/components/schemas/HealthResponse"},
                        },
                    },
                },
            },
        },
    },
    "/cars": {
        get: {
            tags: ["Cars"],
            summary: "List cars with filtering and pagination",
            parameters: [
                {name: "vin", in: "query", schema: {type: "string"}, description: "Partial VIN match"},
                {name: "make", in: "query", schema: {type: "string"}, description: "Partial make match"},
                {name: "model", in: "query", schema: {type: "string"}, description: "Partial model match"},
                {name: "year", in: "query", schema: {type: "integer"}},
                {name: "status", in: "query", schema: {type: "string"}},
                {name: "userId", in: "query", schema: {type: "string", format: "uuid"}},
                {name: "page", in: "query", schema: {type: "integer", default: 1}},
                {name: "limit", in: "query", schema: {type: "integer", default: 10}},
                {name: "sortBy", in: "query", schema: {type: "string", default: "createdAt"}},
                {name: "sortOrder", in: "query", schema: {type: "string", enum: ["ASC", "DESC"], default: "DESC"}},
            ],
            responses: {
                200: {
                    description: "List of cars",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/CarListResponse"}}},
                },
            },
        },
        post: {
            tags: ["Cars"],
            summary: "Create a new car",
            requestBody: {
                required: true,
                content: {"application/json": {schema: {$ref: "#/components/schemas/CarInput"}}},
            },
            responses: {
                201: {
                    description: "Car created",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/CarResponse"}}},
                },
                400: {
                    description: "Validation error",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/ErrorResponse"}}},
                },
                409: {
                    description: "Duplicate VIN",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/ErrorResponse"}}},
                },
            },
        },
    },
    "/cars/{carId}": {
        parameters: [
            {name: "carId", in: "path", required: true, schema: {type: "string", format: "uuid"}},
        ],
        get: {
            tags: ["Cars"],
            summary: "Get a car by ID",
            responses: {
                200: {
                    description: "Car details",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/CarResponse"}}},
                },
                404: {
                    description: "Car not found",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/ErrorResponse"}}},
                },
            },
        },
        put: {
            tags: ["Cars"],
            summary: "Update car details",
            requestBody: {
                required: true,
                content: {"application/json": {schema: {$ref: "#/components/schemas/CarInput"}}},
            },
            responses: {
                200: {
                    description: "Car updated",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/CarResponse"}}},
                },
                404: {description: "Car not found"},
                409: {description: "VIN conflict"},
            },
        },
        delete: {
            tags: ["Cars"],
            summary: "Delete a car",
            responses: {
                200: {
                    description: "Car deleted",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {type: "string", example: "Car deleted successfully"},
                                    data: {
                                        type: "object",
                                        properties: {
                                            deleted: {type: "boolean", example: true},
                                            id: {type: "string", format: "uuid"}
                                        }
                                    }
                                },
                            },
                        },
                    },
                },
                404: {description: "Car not found"},
            },
        },
    },
    // --- Service Configuration Endpoints ---
    "/service-configurations/{userId}": {
        parameters: [
            {
                name: "userId",
                in: "path",
                required: true,
                schema: {type: "string", format: "uuid"},
                description: "UUID of the user"
            }
        ],
        get: {
            tags: ["Service Configuration"],
            summary: "Get service configuration for a specific user",
            description: "Retrieves the current notification settings and alert preferences for the user.",
            responses: {
                200: {
                    description: "Service configuration details",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/ServiceConfigurationResponse"}}}
                },
                404: {
                    description: "Configuration not found for this user",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/ErrorResponse"}}}
                }
            }
        },
        put: {
            tags: ["Service Configuration"],
            summary: "Update service configuration",
            description: "Updates notification methods and alert types. Note: You can only enable methods/alerts that are permitted by your active subscription.",
            requestBody: {
                required: true,
                content: {"application/json": {schema: {$ref: "#/components/schemas/ServiceConfigurationUpdateInput"}}}
            },
            responses: {
                200: {
                    description: "Configuration updated successfully",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/ServiceConfigurationResponse"}}}
                },
                400: {
                    description: "Validation error (e.g., method not in subscription)",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/ErrorResponse"}}}
                },
                404: {
                    description: "Configuration or Subscription not found",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/ErrorResponse"}}}
                }
            }
        }
    },
    // --- Subscription Endpoints ---
    "/subscriptions": {
        get: {
            tags: ["Subscriptions"],
            summary: "List subscriptions with filtering",
            parameters: [
                {name: "userId", in: "query", schema: {type: "string", format: "uuid"}},
                {
                    name: "alertType",
                    in: "query",
                    schema: {type: "string"},
                    description: "Filter by specific alert type presence"
                },
                {name: "page", in: "query", schema: {type: "integer", default: 1}},
                {name: "limit", in: "query", schema: {type: "integer", default: 10}},
                {name: "sortBy", in: "query", schema: {type: "string", default: "createdAt"}},
                {name: "sortOrder", in: "query", schema: {type: "string", enum: ["ASC", "DESC"], default: "DESC"}},
            ],
            responses: {
                200: {
                    description: "List of subscriptions",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/SubscriptionListResponse"}}},
                },
            },
        },
        post: {
            tags: ["Subscriptions"],
            summary: "Create a subscription",
            requestBody: {
                required: true,
                content: {"application/json": {schema: {$ref: "#/components/schemas/SubscriptionInput"}}},
            },
            responses: {
                201: {
                    description: "Subscription created",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/SubscriptionResponse"}}},
                },
                400: {
                    description: "Validation error (invalid user or types)",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/ErrorResponse"}}},
                },
                409: {
                    description: "Subscription already exists for user",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/ErrorResponse"}}},
                },
            },
        },
    },
    "/subscriptions/{id}": {
        parameters: [
            {name: "id", in: "path", required: true, schema: {type: "string", format: "uuid"}},
        ],
        get: {
            tags: ["Subscriptions"],
            summary: "Get subscription by ID",
            responses: {
                200: {
                    description: "Subscription details",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/SubscriptionResponse"}}},
                },
                404: {
                    description: "Subscription not found",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/ErrorResponse"}}},
                },
            },
        },
        put: {
            tags: ["Subscriptions"],
            summary: "Update subscription",
            requestBody: {
                required: true,
                content: {"application/json": {schema: {$ref: "#/components/schemas/SubscriptionUpdateInput"}}},
            },
            responses: {
                200: {
                    description: "Subscription updated",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/SubscriptionResponse"}}},
                },
                400: {description: "Invalid types"},
                404: {description: "Subscription not found"},
            },
        },
        delete: {
            tags: ["Subscriptions"],
            summary: "Delete subscription",
            description: "Deletes subscription and the corresponding service configuration.",
            responses: {
                200: {
                    description: "Subscription deleted",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {type: "string", example: "Subscription deleted successfully"},
                                    data: {
                                        type: "object",
                                        properties: {
                                            deleted: {type: "boolean", example: true},
                                            subscriptionId: {type: "string", format: "uuid"},
                                            userId: {type: "string", format: "uuid"}
                                        }
                                    }
                                },
                            },
                        },
                    },
                },
                404: {description: "Subscription not found"},
            },
        },
    },
    // --- Ingestion Endpoints ---
    "/ingestion/audio": {
        post: {
            tags: ["Ingestion"],
            summary: "Ingest and process audio file",
            description: "Uploads an audio file along with metadata for processing and ML classification. The metadata JSON string must include carId, deviceId, timestamp, etc.",
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                file: {
                                    type: "string",
                                    format: "binary",
                                    description: "Audio file (wav, mp3, etc.)"
                                },
                                data: {
                                    type: "string",
                                    description: "Stringified JSON object containing metadata (carId, deviceId, timestamp, location, etc.)",
                                    example: "{\"carId\": \"uuid...\", \"deviceId\": \"cam-01\", \"timestamp\": \"2023-10-27T10:00:00Z\", \"location\": \"37.77,-122.41\"}"
                                }
                            },
                            required: ["file", "data"]
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Audio processed successfully",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/IngestionResponse"}}}
                },
                400: {
                    description: "Missing file or invalid metadata format",
                    content: {"application/json": {schema: {$ref: "#/components/schemas/ErrorResponse"}}}
                }
            }
        }
    }
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
        {name: "Auth", description: "Authentication and user management"},
        {name: "System", description: "Service utilities"},
        {name: "Cars", description: "Car management and inventory"},
        {name: "Subscriptions", description: "Subscription plan management"},
        {name: "Service Configuration", description: "Notification and alert settings"},
    ],
    components,
    paths,
};
