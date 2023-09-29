"use strict";

const ProductService = require("../services/product_service");
const ProductServicev2 = require("../services/product_service_xxx");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");

class ProductController {
  async createNewProduct(req, res, next) {
    new SuccessResponse({
      message: "Create new product successfully",
      metadata: await ProductServicev2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }
}

module.exports = new ProductController();
