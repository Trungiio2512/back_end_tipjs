"use strict";

const AccessService = require("../services/access_service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");

class AccessController {
  async login(req, res, next) {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  }
  async signUp(req, res, next) {
    new CREATED({
      message: "Registed OK!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  }
}

module.exports = new AccessController();
