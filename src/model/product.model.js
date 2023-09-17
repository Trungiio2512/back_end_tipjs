"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = "product";
const COLLECTION_NAME = "products";

const ProductSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ["Electronic", "Clothing", "Furnture"] },
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// define the product type = closething
const ClothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: { type: String, required: true },
    material: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
  },
  {
    timestamps: true,
    collection: "clothes",
  }
);
// define the product type = Electronic
const ElectronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: { type: String },
    color: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
  },
  {
    timestamps: true,
    collection: "electronics",
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, ProductSchema),
  clothing: model("clothing", ClothingSchema),
  electronic: model("electronic", ElectronicSchema),
};
