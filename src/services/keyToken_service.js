"use strict";

const keyTokenModel = require("../model/keyToken.model");
const { Types } = require("mongoose");
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
      const option = { upsert: true, new: true };

      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, option);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findById = async (userId) => {
    return await keyTokenModel.findOne({ user: userId }).lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: id });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken: refreshToken });
  };
  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };
}

module.exports = KeyTokenService;
