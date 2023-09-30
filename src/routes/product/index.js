"use strict";

const express = require("express");
const productController = require("../../controller/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtils");

const router = express.Router();

router.get("/search/:keySearch", asyncHandler(productController.getListSearchProduct));
router.get("", asyncHandler(productController.findAllProduct));
router.get("/:product_id", asyncHandler(productController.findProduct));

//signup
//authentication
router.use(authenticationV2);
//
router.post("", asyncHandler(productController.createNewProduct));
router.post("/publish/:id", asyncHandler(productController.publishProductByShop));
router.post("/unpublish/:id", asyncHandler(productController.unPublishProductByShop));

//QUERY
router.get("/published/all", asyncHandler(productController.getAllPublishForShop));
router.get("/drafts/all", asyncHandler(productController.getAllDraftForShop));

module.exports = router;
