"use strict";

const shopModel = require("../model/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken_service");
const { createTokenPair } = require("../auth/authUtils");

const roleShop = {
  SHOP: "0000",
  WRITER: "0001",
  EDITER: "0002",
  ADMIN: "0003",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //step 1: check email has exist
      const holderShop = await shopModel.findOne({ email });

      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop already registered",
        };
      }
      const hasPassword = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({ email, name, password: hasPassword, roles: [roleShop.SHOP] });

      if (newShop) {
        //created privatekey and public key
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 4096 });

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "publicKeyString error",
          };
        }

        const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
        console.log("create token success: ", tokens);

        return {
          code: "201",
          metadata: { shop: newShop, tokens },
        };
      }

      return {
        code: "200",
        metadata: null,
      };
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
