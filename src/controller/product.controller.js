"use strict";

const ProductService = require("../services/product_service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");

class ProductController {
  async createNewProduct(req, res, next) {
    new SuccessResponse({
      message: "Create new product successfully",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }
}

module.exports = new ProductController();
