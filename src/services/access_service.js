"use strict";

const shopModel = require("../model/shop.model");
const bcrypt = require("bcrypt");
// const crypto = require("crypto");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken_service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const roleShop = {
  SHOP: "0000",
  WRITER: "1111",
  EDITER: "2222",
  ADMIN: "3333",
};

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
      const hasPassword = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({ email, name, password: hasPassword, roles: [roleShop.SHOP] });

      if (newShop) {
        //created privatekey and public key
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        // });
        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "publicKeyString error",
          };
        }

        //for algorithms
        // const publicKeyObject = crypto.createPublicKey(publicKeyString);
        // const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyObject, privateKey);

        const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
        // console.log("create token success: ", tokens);

        return {
          code: "201",
          metadata: { shop: getInfoData({ fields: ["name", "email", "_id"], object: newShop }), tokens },
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
