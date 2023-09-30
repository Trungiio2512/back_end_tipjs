"use strict";

const ProductService = require("../services/product_service");
const ProductServicev2 = require("../services/product_service_xxx");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");

class ProductController {
  async createNewProduct(req, res, next) {
    // console.log(req.body);
    new SuccessResponse({
      message: "Create new product successfully",
      metadata: await ProductServicev2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

  async publishProductByShop(req, res) {
    new SuccessResponse({
      message: "Publish product successfully",
      metadata: await ProductServicev2.publishProductShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

  async unPublishProductByShop(req, res) {
    new SuccessResponse({
      message: "UnPublish product successfully",
      metadata: await ProductServicev2.unPublishProductShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }
  /**
   * @desc Get all draft products
   * @param {Number} limit
   * @param {String} product_shop
   * @return {JSON}
   */
  async getAllDraftForShop(req, res, next) {
    // console.log(req.body);
    new SuccessResponse({
      message: "Get list Draft success",
      metadata: await ProductServicev2.findAllDraftForShop({
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

  async getAllPublishForShop(req, res, next) {
    // console.log(req.body);
    new SuccessResponse({
      message: "Get list Draft success",
      metadata: await ProductServicev2.findAllPublishForShop({
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

  async getListSearchProduct(req, res, next) {
    // console.log(req.body);
    new SuccessResponse({
      message: "Get list getListSearchProduct success",
      metadata: await ProductServicev2.getListSearchProduct({
        keySearch: req.params.keySearch,
      }),
    }).send(res);
  }
}

module.exports = new ProductController();
