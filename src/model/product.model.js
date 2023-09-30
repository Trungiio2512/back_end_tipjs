"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
const slugify = require("slugify");
const DOCUMENT_NAME = "product";
const COLLECTION_NAME = "products";

const ProductSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_slug: { type: String },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ["Electronic", "Clothing", "Furnture"] },
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    //more
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be above 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variantions: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    unPublish: { type: Boolean, default: true, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//create index for search
ProductSchema.index({ product_name: "text", product_description: "text" });

// document middleware runs before .save .create
ProductSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

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

const furnitureShema = new Schema(
  {
    brand: { type: String, required: true },
    size: { type: String, required: true },
    material: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
  },
  {
    timestamps: true,
    collection: "furniture",
  }
);
module.exports = {
  product: model(DOCUMENT_NAME, ProductSchema),
  clothing: model("clothing", ClothingSchema),
  electronic: model("electronic", ElectronicSchema),
  furniture: model("furniture", furnitureShema),
};
