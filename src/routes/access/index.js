"use strict";

const express = require("express");
const accessController = require("../../controller/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

//signup
router.post("/shop/signUp", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));

//authentication
router.use(authentication);
//
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post("/shop/handleRefeshToken", asyncHandler(accessController.handleRefreshToken));
// router.post("/shop/logout", accessController.logout);
// router.post("/shop/handleRefeshToken", accessController.);

module.exports = router;
