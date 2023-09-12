const { Schema, model, Types } = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = "apikey";
const COLLECTION_NAME = "apikeys";
var apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      enum: ["0000", "1111", "2222", "3333"],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);
