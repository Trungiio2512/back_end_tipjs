"use strict";

const shopModel = require("../model/shop.model");
const bcrypt = require("bcrypt");
// const crypto = require("crypto");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken_service");
const { createTokenPair, verifyToken } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("./shop_service");

const roleShop = {
  SHOP: "0000",
  WRITER: "1111",
  EDITER: "2222",
  ADMIN: "3333",
};

class AccessService {
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore?._id);
    console.log(delKey);
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    /* 
    1 - check email in dbs
    2 - match password
    3 - create AT vs RT and save
    4 - generate tokens
    5 - get data return login */
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError(`Could not found shop`);
    }

    const match = bcrypt.compare(password, foundShop?.password);
    if (!match) {
      throw new AuthFailureError("Authentication error");
    }

    const { _id: userId } = foundShop;
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      refreshToken: tokens?.refreshToken,
      privateKey,
      publicKey,
      userId,
    });

    return {
      shop: getInfoData({ fields: ["name", "email", "_id"], object: foundShop }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // try {
    //step 1: check email has exist
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      // return {
      //   code: "xxx",
      //   message: "Shop already registered",
      // };
      throw new BadRequestError("Error: Shop already registered");
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
        shop: getInfoData({ fields: ["name", "email", "_id"], object: newShop }),
        tokens,
      };
    }

    return null;
    // } catch (error) {
    //   return {
    //     code: "xxx",
    //     message: error.message,
    //     status: "error",
    //   };
    // }
  };

  static handleRefreshToken = async (refreshToken) => {
    /* 
    1 - check token uses ?
    */
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    console.log("foundTOken: ", foundToken);
    if (foundToken) {
      // decode xem may la ai
      const { userId, email } = await verifyToken(refreshToken, foundToken?.privateKey);
      console.log({ userId, email });
      //xoa token trong keystore
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened! Plese relogin");
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);

    if (!holderToken) throw new AuthFailureError("Shop is not registered 1");
    const { userId, email } = await verifyToken(refreshToken, holderToken?.privateKey);
    console.log({ userId, email });
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop is not registered 2");

    // tao cap token moi
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      holderToken.publicKey,
      holderToken.privateKey
    );
    //update
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens?.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });
    return {
      user: { userId, email },
      tokens,
    };
  };
}

module.exports = AccessService;
