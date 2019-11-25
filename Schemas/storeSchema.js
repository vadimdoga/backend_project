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
    unique: true,
    required: true
  },
  storeAddress: String,
  storeImage: {
    data: Buffer,
    contentType: String
  },
  userId: String
})

module.exports = mongoose.model("Store", storeSchema)