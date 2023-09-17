"use strict";

const { product, clothing, electronic } = require("../model/product.model");
const { BadRequestError } = require("../core/error.response");

//define factory patten to create product

class FactoryProduct {
  static async createProduct(type, payload) {
    /* 
        type: 'Clothing'
        payload
    */

    switch (type) {
      case "Electronics":
        return await new Electronic(payload).createProduct();
      case "Clothing":
        return await new Clothing(payload).createProduct();
      default:
        throw new BadRequestError("Invalid product type: " + type);
    }
  }
}

// define basic product class
//product_name,product_thumb,product_description,product_price,product_quantity,product_type,product_shop,product_attributes

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    await product.create({ ...this, _id: product_id });
  }
}

//define class diffrent product type by clothing

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({ ...this.product_attributes, product_shop: this.product_shop });
    if (!newClothing) throw new BadRequestError("Create new clothing error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }
}
//define class diffrent product type by electronic

class Electronic extends Product {
  async createProduct() {
    const newElec = await electronic.create({ ...this.product_attributes, product_shop: this.product_shop });
    if (!newElec) throw new BadRequestError("Create new electronic error");

    const newProduct = await super.createProduct(newElec._id);
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }
}

module.exports = FactoryProduct;
