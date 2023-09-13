"use strict";

const httpStatusCode = require("./httpStatusCode");

class SuccessResponse {
  constructor({
    message,
    statusCode = httpStatusCode.StatusCodes.OK,
    reasonStatusCode = httpStatusCode.ReasonPhrases.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}
class CREATED extends SuccessResponse {
  constructor({
    message,
    metadata,
    statusCode = httpStatusCode.StatusCodes.CREATED,
    reasonStatusCode = httpStatusCode.StatusCodes.CREATED,
  }) {
    super({ message, metadata, statusCode, reasonStatusCode });
  }
}

module.exports = {
  OK,
  CREATED,
};
