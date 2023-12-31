"use strict";

const { findById } = require("../services/apiKey_service");
const { HEADER } = require("../utils/constants");

const apiKey = async (req, res, next) => {
  try {
    const key = req?.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden error",
      });
    }

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(error);
  }
};

const permissions = (permissions) => {
  return (req, res, next) => {
    if (!req?.objKey?.permissions) {
      return req.status(403).json({
        message: "Permission denied",
      });
    }
    // console.log("permissions: ", req?.objKey?.permissions);

    const validPermissions = req?.objKey?.permissions.includes(permissions);
    if (!validPermissions) {
      return req.status(403).json({
        message: "Permission denied",
      });
    }
    return next();
  };
};

module.exports = {
  apiKey,
  permissions,
};
