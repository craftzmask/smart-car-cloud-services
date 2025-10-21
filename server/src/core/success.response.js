"use strict";

const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonPhrase = ReasonPhrases.OK,
    data = {},
  }) {
    this.message = message || reasonPhrase;
    this.status = statusCode;
    this.data = data;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, data }) {
    super({ message, data });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonPhrase = ReasonPhrases.CREATED,
    data = {},
  }) {
    super({ message, statusCode, reasonPhrase, data });
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse,
};
