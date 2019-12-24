const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  productTitle: {
    type: String,
    required: true,
    min: 4,
    max: 255
  },
  productDescription: {
    type: String,
    min: 6,
    max: 1024
  },
  productCategories: [{
    type: String,
    required: true
  }],
  productImages: [{
    data: String,
    contentType: String
  }],
  productPrice: {
    type: Number,
    required: true,
    min: 1,
    max: 100000000
  },
  storeId: {
    type: String
  }
})

module.exports = mongoose.model("Product", productSchema)