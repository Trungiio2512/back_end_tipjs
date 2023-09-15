"use strict";

const express = require("express");
const productController = require("../../controller/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

//signup
//authentication
router.use(authentication);
//
router.post("", asyncHandler(productController.createNewProduct));

module.exports = router;
