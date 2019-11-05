const mongoose = require('mongoose')
const Schema = mongoose.Schema

const storeSchema = new Schema({
  storeName: String,
  storeEmail: String,
  storeAddress: String,
  storeImage: {
    data: Buffer,
    contentType: String
  }
})

module.exports = mongoose.model("Store", storeSchema)