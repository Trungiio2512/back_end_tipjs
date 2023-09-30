"use strict";

const { product, clothing, electronic, furniture } = require("../model/product.model");
const { BadRequestError } = require("../core/error.response");
const {
  findAllDraftForShop,
  publishProductShop,
  findAllPublishForShop,
  unPublishProductShop,
  searchProductByUser,
  findAllProduct,
  findProduct,
} = require("../model/repository/product.repo");

//define factory patten to create product

class FactoryProduct {
  static productResgistry = {};

  static registerProductType = (type, classRef) => {
    FactoryProduct.productResgistry[type] = classRef;
  };

  static async createProduct(type, payload) {
    /* 
        type: 'Clothing'
        payload
    */
    const productClass = FactoryProduct.productResgistry[type];

    if (!productClass) {
      throw new BadRequestError("Invalid product type: " + type);
    }
    return new productClass(payload).createProduct();

    // switch (type) {
    //   case "Electronics":
    //     return await new Electronic(payload).createProduct();
    //   case "Clothing":
    //     return await new Clothing(payload).createProduct();
    //   case "Clothing":
    //   case "Furniture":
    //     return await new Furniture(payload).createProduct();
    //   default:
    //     throw new BadRequestError("Invalid product type: " + type);
    // }
  }

  static async updateProduct(type, payload) {
    /* 
        type: 'Clothing'
        payload
    */
    const productClass = FactoryProduct.productResgistry[type];

    if (!productClass) {
      throw new BadRequestError("Invalid product type: " + type);
    }
    return new productClass(payload).createProduct();
  }

  //Put
  static async publishProductShop({ product_shop, product_id }) {
    return await publishProductShop({
      product_shop,
      product_id,
    });
  }

  static async unPublishProductShop({ product_shop, product_id }) {
    return await unPublishProductShop({
      product_shop,
      product_id,
    });
  }
  //End Put

  //Query
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };

    return await findAllDraftForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };

    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProduct({ limit = 50, sort = "ctime", page = 1, filter = { isPublished: true } }) {
    return await findAllProduct({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
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
    return await product.create({ ...this, _id: product_id });
  }
}

//define class diffrent product type by clothing

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({ ...this.product_attributes, product_shop: this.product_shop });
    if (!newClothing) throw new BadRequestError("Create new clothing error");

    const newProduct = await super.createProduct(newClothing._id);
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

class Furniture extends Product {
  async createProduct() {
    const newFur = await furniture.create({ ...this.product_attributes, product_shop: this.product_shop });
    if (!newFur) throw new BadRequestError("Create new electronic error");

    const newProduct = await super.createProduct(newFur._id);
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }
}

//register product type

FactoryProduct.registerProductType("Clothing", Clothing);
FactoryProduct.registerProductType("Electronic", Electronic);
FactoryProduct.registerProductType("Furniture", Furniture);

module.exports = FactoryProduct;
