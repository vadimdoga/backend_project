const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  productTitle: {
    type: String,
    required: true
  },
  productDescription: {
    type: String
  },
  productCategories: [{
    type: String,
    required: true
  }],
  productImages: [{
    type: Buffer,
    contentType: String,
    required: true
  }],
  productPrice: {
    type: Number,
    required: true
  },
  storeId: String
})

module.exports = mongoose.model("Product", productSchema)