"use strict";

const httpStatusCode = require("./httpStatusCode");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = httpStatusCode.ReasonPhrases.CONFLICT, statusCode = httpStatusCode.StatusCodes.FORBIDDEN) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = httpStatusCode.ReasonPhrases.CONFLICT, statusCode = httpStatusCode.StatusCodes.FORBIDDEN) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
};
