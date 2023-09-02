"use strict";

const shopModel = require("../model/shop.model");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //step 1: check email has exist
      const holderShop = await shopModel.findOne({ email }).lean();

      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop already registered",
        };
      }

      const newShop = await shopModel.create({ email, name, password, roles });
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
