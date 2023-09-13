"use strict";

const keyTokenModel = require("../model/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      /* 
      lv1
    For algorithms rsa
    const publicKeyString = publicKey.toString();
    const tokens = await keyTokenModel.create({ user: userId, publicKey: publicKeyString });
    const tokens = await keyTokenModel.create({ user: userId, publicKey, privateKey });
    return tokens ? tokens.publicKey : null;
    */
      /* lv2 */
      const filter = {
        user: userId,
      };
      const update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken };
      const option = { upset: true, new: true };

      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, option);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
