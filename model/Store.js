const mongoose = require('mongoose')
const Schema = mongoose.Schema

const storeSchema = new Schema({
  storeName: {
    type: String,
    unique: true,
    required: true
  },
  storeEmail:{
    type: String,
    required: true
  },
  storeAddress: {
    type: String,
    required: true
  },
  storeImage: {
    data: Buffer,
    contentType: String,
    required: true
  },
  userId: String
})

module.exports = mongoose.model("Store", storeSchema)