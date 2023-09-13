"use strict";

const AccessService = require("../services/access_service");
const { OK, CREATED } = require("../core/success.response");

class AccessController {
  async signUp(req, res, next) {
    new CREATED({
      message: "Registed OK!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  }
}

module.exports = new AccessController();
