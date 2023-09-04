"use strict";

const keyTokenModel = require("../model/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      /* 
    For algorithms rsa
    const publicKeyString = publicKey.toString();
    const tokens = await keyTokenModel.create({ user: userId, publicKey: publicKeyString });
    */
      const tokens = await keyTokenModel.create({ user: userId, publicKey, privateKey });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
