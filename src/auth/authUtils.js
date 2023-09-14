"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { HEADER } = require("../utils/constants");
const { AuthFailureError, NotFound } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken_service");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, privateKey, {
      expiresIn: "2 days",
      // algorithm: "RS256",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
      // algorithm: "RS256",
    });

    //

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /* 
    1 - check missing userId
    2 - get AT
    3 - verify token 
    4 - check user in DB ?
    5 - check keyStore with userId
    6 - all => return next()
  */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request");

  const keyStore = await KeyTokenService.findById(userId);
  if (!keyStore) throw new NotFound("Not found keyStore");

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request");

  try {
    const decodeUser = JWT.decode(accessToken, keyStore.publicKey);

    if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid user");

    req.keyStore = keyStore;

    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  createTokenPair,
  authentication,
};
